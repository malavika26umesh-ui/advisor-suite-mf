from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.models.scheduler_models import Booking
from app.core.config import settings

class EmailSender:
    def __init__(self):
        self.sg = None
        if hasattr(settings, 'SENDGRID_API_KEY') and settings.SENDGRID_API_KEY:
            self.sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        # Must match the verified Single Sender in SendGrid, not a fictional
        # domain — SendGrid rejects sends from unverified From addresses.
        self.from_email = "malavika26.umesh@gmail.com"

    def _send_email(self, message: Mail) -> bool:
        if not self.sg:
            print("SendGrid API key not configured. Mocking email send.")
            return True # Mock success
        try:
            response = self.sg.send(message)
            return response.status_code in [200, 201, 202]
        except Exception as e:
            body = getattr(e, "body", None)
            print(f"Error sending email: {e} | body: {body}")
            return False

    def send_booking_confirmation(self, email: str, booking: Booking) -> bool:
        html_content = f"""
        <h2>Booking Confirmation</h2>
        <p>Your appointment has been booked.</p>
        <p><strong>Booking Code:</strong> <span style="font-family: monospace; font-size: 24px;">{booking.booking_code}</span></p>
        <p><strong>Advisor:</strong> {booking.advisor.name if booking.advisor else ''}</p>
        <p><strong>Topic:</strong> {booking.topic_category}</p>
        <p><strong>Time:</strong> {booking.slot_datetime.strftime('%Y-%m-%d %H:%M') if booking.slot_datetime else ''}</p>
        <p>To cancel or reschedule, please provide your booking code and email.</p>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=email,
            subject="Your AdvisorSuite MF Booking Confirmation",
            html_content=html_content
        )
        return self._send_email(message)

    def send_cancellation_confirmation(self, email: str, booking: Booking) -> bool:
        html_content = f"""
        <h2>Booking Cancelled</h2>
        <p>Your appointment {booking.booking_code} with {booking.advisor.name if booking.advisor else ''} has been cancelled.</p>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=email,
            subject="Your AdvisorSuite MF Booking Cancelled",
            html_content=html_content
        )
        return self._send_email(message)

    def send_reschedule_notification(self, email: str, booking: Booking) -> bool:
        html_content = f"""
        <h2>Booking Rescheduled</h2>
        <p>Your appointment {booking.booking_code} with {booking.advisor.name if booking.advisor else ''} has been rescheduled to {booking.slot_datetime.strftime('%Y-%m-%d %H:%M') if booking.slot_datetime else ''}.</p>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=email,
            subject="Your AdvisorSuite MF Booking Rescheduled",
            html_content=html_content
        )
        return self._send_email(message)

    def send_post_meeting_feedback(self, email: str, booking: Booking) -> bool:
        html_content = f"""
        <h2>Meeting Completed</h2>
        <p>Your appointment {booking.booking_code} with {booking.advisor.name if booking.advisor else ''} is complete.</p>
        <p>How useful was your call?</p>
        <ul>
            <li><a href="#">Very Useful</a></li>
            <li><a href="#">Somewhat Useful</a></li>
            <li><a href="#">Not Useful</a></li>
        </ul>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=email,
            subject="AdvisorSuite MF - Meeting Feedback",
            html_content=html_content
        )
        return self._send_email(message)

    def send_pulse_notification(self, emails: list[str], top_themes: list[str], fee_spotlight_term: str) -> bool:
        if not emails:
            return True
        themes_html = "".join(f"<li>{t}</li>" for t in top_themes)
        html_content = f"""
        <h2>Weekly Product Pulse</h2>
        <p>This week's top investor themes:</p>
        <ul>{themes_html}</ul>
        <p><strong>Fee Spotlight:</strong> {fee_spotlight_term}</p>
        <p>View the full report on the Advisor Dashboard.</p>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=emails,
            subject="AdvisorSuite MF - Weekly Product Pulse",
            html_content=html_content
        )
        return self._send_email(message)

    def send_advisor_otp(self, advisor_email: str, otp: str) -> bool:
        html_content = f"""
        <h2>Advisor Login OTP</h2>
        <p>Your OTP is: <strong>{otp}</strong></p>
        """
        message = Mail(
            from_email=self.from_email,
            to_emails=advisor_email,
            subject="AdvisorSuite MF - Login OTP",
            html_content=html_content
        )
        if not self.sg:
            print(f"--- LOCAL DEV OTP --- Login with OTP: {otp} for {advisor_email}")
        return self._send_email(message)
