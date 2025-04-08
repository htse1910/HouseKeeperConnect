using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class VerificationTaskDAO
    {
        private static VerificationTaskDAO instance;
        public static readonly object instancelock = new object();

        public VerificationTaskDAO()
        { }

        public static VerificationTaskDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new VerificationTaskDAO();
                    }
                    return instance;
                }
            }
        }

        /*public async Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize)
        {
            var list = new List<VerificationTask>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.VerificationTask
                        .Where(t => t.Status == 1)
                        .AsNoTracking()
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }*/

        public async Task<VerificationTask> GetTaskByIdAsync(int taskId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.VerificationTask
                        .Include(t => t.IDVerification)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(t => t.TaskID == taskId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<VerificationTask> GetTaskByVerificationIdAsync(int verifyId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.VerificationTask
                        .Include(v => v.IDVerification)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(t => t.VerifyID == verifyId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task CreateVerificationTaskAsync(VerificationTask task)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.VerificationTask.Add(task);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateVerificationTaskAsync(VerificationTask task)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.VerificationTask.Attach(task);
                    context.Entry(task).State = EntityState.Modified;

                    if (task.IDVerification != null)
                    {
                        context.IDVerification.Attach(task.IDVerification);
                        context.Entry(task.IDVerification).State = EntityState.Modified;
                    }

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