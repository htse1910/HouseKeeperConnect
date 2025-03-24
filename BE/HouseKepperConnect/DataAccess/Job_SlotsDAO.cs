using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class Job_SlotsDAO
    {
        private static Job_SlotsDAO instance;
        private static readonly object instanceLock = new object();

        public static Job_SlotsDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new Job_SlotsDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Job_Slots>> GetAllJob_SlotsAsync()
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Slots.Include(js => js.Job).Include(js => js.Slot).ToListAsync();
        }

        public async Task<Job_Slots> GetJob_SlotByIdAsync(int id)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Slots.Include(js => js.Job).Include(js => js.Slot)
                .SingleOrDefaultAsync(js => js.Job_SlotsId == id);
        }

        public async Task<List<Job_Slots>> GetJob_SlotsByJobIdAsync(int jobId)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Slots.Where(js => js.JobID == jobId).Include(js => js.Slot).ToListAsync();
        }

        public async Task<List<Job_Slots>> GetJob_SlotsBySlotIdAsync(int slotId)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Slots.Where(js => js.SlotID == slotId).Include(js => js.Job).ToListAsync();
        }

        public async Task AddJob_SlotAsync(Job_Slots jobSlot)
        {
            using var context = new PCHWFDBContext();
            context.Job_Slots.Add(jobSlot);
            await context.SaveChangesAsync();
        }

        public async Task DeleteJob_SlotAsync(int id)
        {
            using var context = new PCHWFDBContext();
            var jobSlot = await context.Job_Slots.FindAsync(id);
            if (jobSlot != null)
            {
                context.Job_Slots.Remove(jobSlot);
                await context.SaveChangesAsync();
            }
        }
    }
}