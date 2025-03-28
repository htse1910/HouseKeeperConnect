using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class NotificationDAO
    {
        private static NotificationDAO instance;
        private static readonly object instancelock = new object();

        public NotificationDAO()
        { }

        public static NotificationDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new NotificationDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Notification>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Notification.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Notification> GetNotificationByIDAsync(int id)
        {
            Notification Notification = new Notification();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Notification = await context.Notification.SingleOrDefaultAsync(x => x.NotificationsID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Notification;
        }

        public async Task<int> GetTotalNotisByUserAsync(int id)
        {
            int totalNotis;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    totalNotis = await context.Notification.Where(n => n.IsRead == false && n.AccountID == id).CountAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return totalNotis;
        }

        public async Task<List<Notification>> GetNotificationsByUserAsync(int uId, int pageNumber, int pageSize)
        {
            var trans = new List<Notification>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Notification.Where(t => t.AccountID == uId).OrderBy(n => n.IsRead)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task AddNotificationAsync(Notification noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Notification.Add(noti);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteNotificationAsync(int id)
        {
            var Notification = await GetNotificationByIDAsync(id);
            if (Notification != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Notification.Remove(Notification);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateNotificationAsync(Notification noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(noti).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}