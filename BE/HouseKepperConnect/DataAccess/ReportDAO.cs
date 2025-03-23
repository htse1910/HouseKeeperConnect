using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ReportDAO
    {
        private static ReportDAO instance;
        public static readonly object instancelock = new object();

        public ReportDAO()
        { }

        public static ReportDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new ReportDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Report>> GetAllReportsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Report>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Report.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Report> GetReportByIDAsync(int rID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Report.FirstOrDefaultAsync(r => r.ReportID == rID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddReportAsync(Report Report)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Report.Add(Report);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteReportAsync(int id)
        {
            var Report = await GetReportByIDAsync(id);
            if (Report != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Report.Remove(Report);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateReportAsync(Report Report)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Report).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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