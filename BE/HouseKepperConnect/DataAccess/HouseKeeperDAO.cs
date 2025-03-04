using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class HousekeeperDAO
    {

        private static HousekeeperDAO instance;
        private static readonly object instancelock = new object();

        public HousekeeperDAO()
        { }

        public static HousekeeperDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new HousekeeperDAO();
                    }
                    return instance;
                }
            }
        }
        public async Task<List<Housekeeper>> GetAllHousekeepersAsync()
        {
            var list = new List<Housekeeper>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Housekeeper.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Housekeeper> GetHousekeeperByIDAsync(int id)
        {
            Housekeeper Housekeeper = new Housekeeper();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Housekeeper = await context.Housekeeper.SingleOrDefaultAsync(x => x.HouseKeeperID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Housekeeper;
        }

        public async Task<Housekeeper> GetHousekeepersByUserAsync(int uId)
        {
            var trans = new Housekeeper();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Housekeeper.SingleOrDefaultAsync(x => x.AccountID== uId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task AddHousekeeperAsync(Housekeeper trans)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Housekeeper.Add(trans);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteHousekeeperAsync(int id)
        {
            var Housekeeper = await GetHousekeeperByIDAsync(id);
            if (Housekeeper != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Housekeeper.Remove(Housekeeper);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateHousekeeperAsync(Housekeeper trans)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(trans).State = EntityState.Modified;
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
