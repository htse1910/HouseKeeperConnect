using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class VerificationTaskDAO
    {
        private static VerificationTaskDAO instance;
        public static readonly object instancelock = new object();

        public VerificationTaskDAO() { }

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
        public async Task<int> CreateVerificationTaskAsync(VerificationTask task)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var verificationExists = await context.IDVerification.AnyAsync(v => v.VerifyID == task.VerifyID);
                    if (!verificationExists)
                    {
                        throw new Exception($"IDVerification với ID {task.VerifyID} không tồn tại.");
                    }

                    task.Status = 1; // Pending
                    task.AssignedDate = DateTime.UtcNow;

                    context.VerificationTask.Add(task);
                    await context.SaveChangesAsync();
                    return task.TaskID;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi tạo VerificationTask: " + ex.Message);
            }
        }



        public async Task<List<VerificationTask>> GetPendingVerificationTasksAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.VerificationTask
                        .Include(t => t.IDVerification)
                        .Include(t => t.Account) 
                        .Where(t => t.IDVerification.Status == 1) 
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> ApproveVerificationAsync(int taskId, int staffId, string notes)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var staff = await context.Account.FirstOrDefaultAsync(a => a.AccountID == staffId && a.RoleID == 3);
                    if (staff == null)
                    {
                        throw new UnauthorizedAccessException("You do not have permission to approve verification.");
                    }
                    var task = await context.VerificationTask
                        .Include(t => t.IDVerification)
                        .FirstOrDefaultAsync(t => t.TaskID == taskId);

                    if (task == null || task.IDVerification == null || task.IDVerification.Status != 1)
                    {
                        return false;
                    }

                    task.AccountID = staffId;
                    task.IDVerification.Status = 2; 
                    task.Status = 2; 
                    task.CompletedDate = DateTime.UtcNow;
                    task.Notes = notes;

                    var housekeeper = await context.Housekeeper.FirstOrDefaultAsync(h => h.VerifyID == task.IDVerification.VerifyID);
                    if (housekeeper != null)
                    {
                        housekeeper.IsVerified = true;
                    }

                    await context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> RejectVerificationAsync(int taskId, int staffId, string notes)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    
                    var staff = await context.Account.FirstOrDefaultAsync(a => a.AccountID == staffId && a.RoleID == 3);
                    if (staff == null)
                    {
                        throw new UnauthorizedAccessException("You do not have permission to reject verification.");
                    }
                    var task = await context.VerificationTask
                        .Include(t => t.IDVerification)
                        .FirstOrDefaultAsync(t => t.TaskID == taskId);

                    if (task == null || task.IDVerification == null || task.IDVerification.Status != 1)
                    {
                        return false;
                    }

                    task.AccountID = staffId;
                    task.IDVerification.Status = 3; 
                    task.Status = 2; 
                    task.CompletedDate = DateTime.UtcNow;
                    task.Notes = notes;

                    await context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
