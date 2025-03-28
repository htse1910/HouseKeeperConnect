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
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IJobService _jobService;
        private readonly IJob_ServiceService _jobServiceService;
        private readonly IJob_SlotsService _jobSlotsService;
        private readonly IMapper _mapper;
        private readonly IBooking_SlotsService _bookingSlotsService;
        private string Message;

        public BookingController(IBookingService bookingService, IJobService jobService, IJob_ServiceService job_ServiceService, IJob_SlotsService job_SlotsService, IBooking_SlotsService booking_SlotsService, IMapper mapper)
        {
            _bookingService = bookingService;
            _jobService = jobService;
            _jobServiceService = job_ServiceService;
            _jobSlotsService = job_SlotsService;
            _bookingSlotsService = booking_SlotsService;
            _mapper = mapper;
        }

        [HttpGet("GetBookings")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsAsync()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            if (bookings == null || !bookings.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpGet("GetBookingByID")]
        [Authorize]
        public async Task<ActionResult<Booking>> GetBookingByID([FromQuery] int id)
        {
            var booking = await _bookingService.GetBookingByIDAsync(id);
            if (booking == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(booking);
        }

        [HttpGet("GetBookingByHousekeeperID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetBookingByHousekeeperID([FromQuery] int housekeeperId)
        {
            var bookings = await _bookingService.GetBookingsByHousekeeperIDAsync(housekeeperId);
            if (bookings == null || !bookings.Any())
            {
                return NotFound("No records!");
            }

            var result = new List<object>();

            foreach (var booking in bookings)
            {
                var job = await _jobService.GetJobByIDAsync(booking.JobID);
                var jobDetail = job != null ? await _jobService.GetJobDetailByJobIDAsync(job.JobID) : null;

                var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(booking.JobID);
                var jobServices = await _jobServiceService.GetJob_ServicesByJobIDAsync(booking.JobID);

                result.Add(new
                {
                    booking.BookingID,
                    booking.JobID,
                    JobDetail = jobDetail,
                    SlotIDs = jobSlots.Select(js => js.SlotID).Distinct().ToList(),
                    DayofWeek = jobSlots.Select(js => js.DayOfWeek).Distinct().ToList(),
                    ServiceIDs = jobServices.Select(js => js.ServiceID).Distinct().ToList()
                });
            }

            return Ok(result);
        }

        [HttpPost("AddBooking")]
        [Authorize]
        public async Task<ActionResult> AddBooking([FromQuery] BookingCreateDTO bookingCreateDTO)
        {
            if (bookingCreateDTO == null)
            {
                return BadRequest("Invalid booking data.");
            }

            // Map Booking DTO to Booking entity
            var booking = _mapper.Map<Booking>(bookingCreateDTO);

            // Add booking to database
            await _bookingService.AddBookingAsync(booking);

            // Retrieve all Job_Slots associated with the given JobID
            var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(bookingCreateDTO.JobID);

            if (jobSlots != null && jobSlots.Any())
            {
                var bookingSlots = jobSlots.Select(js => new Booking_Slots
                {
                    BookingID = booking.BookingID,  // The newly created BookingID
                    SlotID = js.SlotID,
                    DayOfWeek = js.DayOfWeek
                }).ToList();

                // Save all BookingSlots
                await _bookingSlotsService.AddBooking_SlotsAsync(bookingSlots);
            }

            return Ok("Booking added successfully with all related slots!");
        }

        [HttpPut("UpdateBooking")]
        [Authorize]
        public async Task<ActionResult> UpdateBooking([FromQuery] BookingUpdateDTO bookingUpdateDTO)
        {
            var booking = await _bookingService.GetBookingByIDAsync(bookingUpdateDTO.BookingID);
            if (booking == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            _mapper.Map(bookingUpdateDTO, booking);
            await _bookingService.UpdateBookingAsync(booking);
            return Ok("Booking updated successfully!");
        }

        [HttpDelete("DeleteBooking")]
        [Authorize]
        public async Task<ActionResult> DeleteBooking([FromQuery] int id)
        {
            await _bookingService.DeleteBookingAsync(id);
            Message = "Booking deleted successfully!";
            return Ok(Message);
        }
    }
}