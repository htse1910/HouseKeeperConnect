using AutoMapper;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ServiceDAO
    {
        private readonly IMapper _mapper;
        private static ServiceDAO instance;
        private static readonly object instancelock = new object();

        public ServiceDAO()
        { }

        public static ServiceDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new ServiceDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Service>> GetAllServicesAsync()
        {
            var list = new List<Service>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Service.Include(s => s.ServiceType).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Service> GetServiceByIDAsync(int id)
        {
            Service service = new Service();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    service = await context.Service.Include(s => s.ServiceType).SingleOrDefaultAsync(x => x.ServiceID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return service;
        }

        public async Task AddServiceAsync(Service service)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Service.Add(service);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await GetServiceByIDAsync(id);
            if (service != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Service.Remove(service);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateServiceAsync(Service service)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(service).State = EntityState.Modified;
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