using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class IDVerifyDAO
    {
        private static IDVerifyDAO instance;
        private static readonly object instancelock = new object();

        public IDVerifyDAO()
        { }

        public static IDVerifyDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new IDVerifyDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<IDVerification>> GetAllIDVerifysAsync()
        {
            var list = new List<IDVerification>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.IDVerification.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<IDVerification> GetIDVerifyByIDAsync(int id)
        {
            IDVerification IDVerify = new IDVerification();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    IDVerify = await context.IDVerification.SingleOrDefaultAsync(x => x.VerifyID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return IDVerify;
        }

        /*public async Task<IDVerification> GetIDVerifysByUserAsync(int uId)
        {
            var trans = new IDVerification();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.IDVerification.SingleOrDefaultAsync(x => x. == uId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }*/

        public async Task AddIDVerifyAsync(IDVerification veri)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.IDVerification.Add(veri);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateIDVerifyAsync(IDVerification veri)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(veri).State = EntityState.Modified;
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