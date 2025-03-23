using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task AddNotificationAsync(Notification noti) => await _notificationRepository.AddNotificationAsync(noti);

        public async Task DeleteNotificationAsync(int id) => await _notificationRepository.DeleteNotificationAsync(id);

        public async Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize) => await _notificationRepository.GetAllNotificationsAsync(pageNumber, pageSize);

        public async Task<Notification> GetNotificationByIDAsync(int id) => await _notificationRepository.GetNotificationByIDAsync(id);

        public async Task<List<Notification>> GetNotificationsByUserAsync(int uId, int pageNumber, int pageSize) => await _notificationRepository.GetNotificationsByUserAsync(uId, pageNumber, pageSize);

        public async Task<int> GetTotalNotisAsync() => await _notificationRepository.GetTotalNotisAsync();

        public async Task UpdateNotificationAsync(Notification noti) => await _notificationRepository.UpdateNotificationAsync(noti);
    }
}