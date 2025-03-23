using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        public async Task AddNotificationAsync(Notification noti) => await NotificationDAO.Instance.AddNotificationAsync(noti);

        public async Task DeleteNotificationAsync(int id) => await NotificationDAO.Instance.DeleteNotificationAsync(id);

        public async Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize) => await NotificationDAO.Instance.GetAllNotificationsAsync(pageNumber, pageSize);

        public async Task<Notification> GetNotificationByIDAsync(int id) => await NotificationDAO.Instance.GetNotificationByIDAsync(id);

        public async Task<List<Notification>> GetNotificationsByUserAsync(int uId, int pageNumber, int pageSize) => await NotificationDAO.Instance.GetNotificationsByUserAsync(uId, pageNumber, pageSize);

        public async Task<int> GetTotalNotisAsync() => await NotificationDAO.Instance.GetTotalNotisAsync();

        public async Task UpdateNotificationAsync(Notification noti) => await NotificationDAO.Instance.UpdateNotificationAsync(noti);
    }
}