import random
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_db
from app.core.config import settings
from app.models.scheduler_models import Advisor, OTPStore
from app.services.scheduler.email_sender import EmailSender

security = HTTPBearer()

class AdvisorAuth:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.email_sender = EmailSender()

    async def request_otp(self, email: str) -> bool:
        # Check if advisor exists
        result = await self.db.execute(select(Advisor).where(Advisor.email == email, Advisor.is_active == True))
        advisor = result.scalars().first()
        if not advisor:
            return False
            
        # Generate 6-digit OTP
        otp = f"{random.randint(0, 999999):06d}"
        otp_hash = bcrypt.hashpw(otp.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        otp_store = OTPStore(
            email=email,
            otp_hash=otp_hash,
            expires_at=expires_at,
            used=False
        )
        self.db.add(otp_store)
        await self.db.commit()
        
        if hasattr(self.email_sender, 'send_advisor_otp'):
            self.email_sender.send_advisor_otp(email, otp)
            
        return True

    async def verify_otp(self, email: str, otp: str) -> Optional[str]:
        # get latest unused OTP
        result = await self.db.execute(
            select(OTPStore)
            .where(OTPStore.email == email, OTPStore.used == False, OTPStore.expires_at > datetime.utcnow())
            .order_by(OTPStore.id.desc())
        )
        otp_record = result.scalars().first()
        if not otp_record:
            return None
            
        if not bcrypt.checkpw(otp.encode('utf-8'), otp_record.otp_hash.encode('utf-8')):
            return None
            
        otp_record.used = True
        await self.db.commit()
        
        # Generate JWT
        payload = {
            "sub": email,
            "exp": datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return token

    async def validate_token(self, token: str) -> Optional[Advisor]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload.get("sub")
            if not email:
                return None
            result = await self.db.execute(select(Advisor).where(Advisor.email == email, Advisor.is_active == True))
            return result.scalars().first()
        except jwt.PyJWTError:
            return None

async def get_current_advisor(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Advisor:
    auth = AdvisorAuth(db)
    advisor = await auth.validate_token(credentials.credentials)
    if not advisor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return advisor
