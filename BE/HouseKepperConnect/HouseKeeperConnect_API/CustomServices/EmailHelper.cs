using System.Net;
using System.Net.Mail;

namespace HouseKeeperConnect_API.CustomServices
{
    public class EmailHelper
    {
        private readonly IConfiguration _configuration;
        private readonly string _fromEmail;
        private readonly string _displayName;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly bool _enableSsl;

        public EmailHelper(IConfiguration configuration)
        {
            _configuration = configuration;
            _fromEmail = _configuration["EmailSettings:FromEmail"];
            _displayName = _configuration["EmailSettings:DisplayName"];
            _smtpHost = _configuration["EmailSettings:Smtp:Host"];
            _smtpPort = int.Parse(_configuration["EmailSettings:Smtp:Port"]);
            _smtpUsername = _configuration["EmailSettings:Smtp:Username"];
            _smtpPassword = _configuration["EmailSettings:Smtp:Password"];
            _enableSsl = bool.Parse(_configuration["EmailSettings:Smtp:EnableSsl"]);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var smtpClient = new SmtpClient(_smtpHost)
            {
                Port = _smtpPort,
                Credentials = new NetworkCredential(_smtpUsername, _smtpPassword),
                EnableSsl = _enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_fromEmail, _displayName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}