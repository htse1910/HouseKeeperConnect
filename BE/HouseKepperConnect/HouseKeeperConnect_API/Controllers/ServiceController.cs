using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
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
                Message = "No records!";
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
            var service = _mapper.Map<Service>(serviceCreateDTO);
            if (serviceCreateDTO == null)
            {
                return BadRequest("Invalid service data.");
            }

            await _serviceService.AddServiceAsync(service);

            return Ok("Service added successfully!");
        }

        [HttpPut("UpdateService")]
        [Authorize]
        public async Task<ActionResult> UpdateService([FromQuery] ServiceUpdateDTO serviceUpdateDTO)
        {
            var service = await _serviceService.GetServiceByIDAsync(serviceUpdateDTO.ServiceID);
            if (service == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            _mapper.Map(serviceUpdateDTO, service);
            await _serviceService.UpdateServiceAsync(service);

            Message = "Service updated successfully!";
            return Ok(Message);
        }

        [HttpDelete("DeleteService")]
        [Authorize]
        public async Task<ActionResult> DeleteService([FromQuery] int id)
        {
            await _serviceService.DeleteServiceAsync(id);
            Message = "Service deleted successfully!";
            return Ok(Message);
        }
    }
}