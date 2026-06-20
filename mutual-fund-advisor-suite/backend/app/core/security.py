import hashlib
import base64
from app.core.config import settings
from cryptography.fernet import Fernet

def get_encryption_key():
    secret = settings.SECRET_KEY or "fallback_secret_key_for_dev_mode"
    key_bytes = secret.ljust(32, '0').encode('utf-8')[:32]
    return base64.urlsafe_b64encode(key_bytes)

fernet = Fernet(get_encryption_key())

def hash_email(email: str) -> str:
    return hashlib.sha256(email.strip().lower().encode('utf-8')).hexdigest()

def encrypt_data(data: str) -> str:
    if not data:
        return data
    return fernet.encrypt(data.encode('utf-8')).decode('utf-8')

def decrypt_data(encrypted_data: str) -> str:
    if not encrypted_data:
        return encrypted_data
    return fernet.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
