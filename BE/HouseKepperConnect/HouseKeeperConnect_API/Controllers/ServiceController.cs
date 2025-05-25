using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        private string Message;
        private readonly IMapper _mapper;

        public ServiceController(IServiceService serviceService, IMapper mapper)
        {
            _serviceService = serviceService;
            _mapper = mapper;
        }

        [HttpGet("ServiceList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesAsync()
        {
            var services = await _serviceService.GetAllServicesAsync();
            if (services == null || !services.Any())
            {
                Message = "Danh sách dịch vụ trống!";
                return NotFound(Message);
            }

            return Ok(services);
        }

        [HttpGet("GetServiceByID")]
        [Authorize]
        public async Task<ActionResult<Service>> GetServiceByID([FromQuery] int id)
        {
            var service = await _serviceService.GetServiceByIDAsync(id);
            if (service == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(service);
        }

        [HttpPost("AddService")]
        [Authorize]
        public async Task<ActionResult> AddService([FromQuery] ServiceCreateDTO serviceCreateDTO)
        {

            if (serviceCreateDTO == null)
            {
                return BadRequest("Dữ liểu tạo không hợp lệ!");
            }

            var count = await _serviceService.GetAllServicesAsync();
            if (count.Count == 0)
            {

            }

            var ser = new Service();
            ser.ServiceID = count.Count + 2;
            ser.ServiceName = serviceCreateDTO.ServiceName;
            ser.Price = serviceCreateDTO.Price;
            ser.ServiceTypeID = serviceCreateDTO.ServiceTypeID;
            ser.Description = serviceCreateDTO.Description;
            ser.Status = (int)ServiceStatus.Inactive;



            await _serviceService.AddServiceAsync(ser);

            return Ok("Đã tạo dịch vụ mới");
        }

        [HttpPut("UpdateService")]
        [Authorize]
        public async Task<ActionResult> UpdateService([FromQuery] ServiceUpdateDTO serviceUpdateDTO)
        {
            var service = await _serviceService.GetServiceByIDAsync(serviceUpdateDTO.ServiceID);
            if (service == null)
            {
                Message = "Không tìm thấy thông tin dịch vụ!";
                return NotFound(Message);
            }

            _mapper.Map(serviceUpdateDTO, service);
            await _serviceService.UpdateServiceAsync(service);

            Message = "Cập nhật dịch vụ thành công";
            return Ok(Message);
        }

        [HttpPut("DisableService")]
        [Authorize]
        public async Task<ActionResult> DeleteService([FromQuery] int id)
        {
            var ser = await _serviceService.GetServiceByIDAsync(id);
            if (ser==null)
            {
                Message = "Không tìm thấy dịch vụ!";
                return NotFound(Message);
            }

            ser.Status = (int)ServiceStatus.Inactive;
            await _serviceService.UpdateServiceAsync(ser);

            Message = "Dịch vụ đã bị vô hiệu hóa!";
            return Ok(Message);
        }
        
        [HttpPut("EnableService")]
        [Authorize]
        public async Task<ActionResult> EnableService([FromQuery] int id)
        {
            var ser = await _serviceService.GetServiceByIDAsync(id);
            if (ser==null)
            {
                Message = "Không tìm thấy dịch vụ!";
                return NotFound(Message);
            }

            ser.Status = (int)ServiceStatus.Active;
            await _serviceService.UpdateServiceAsync(ser);

            Message = "Dịch vụ đã được kích hoạt!";
            return Ok(Message);
        }
    }
}