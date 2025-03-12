using AutoMapper;
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
        private string Message;
        private readonly IMapper _mapper;

        public BookingController(IBookingService bookingService, IMapper mapper)
        {
            _bookingService = bookingService;
            _mapper = mapper;
        }

        [HttpGet("BookingList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsAsync()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            if (bookings == null || !bookings.Any())
            {
                Message = "No records found!";
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
                Message = "No records found!";
                return NotFound(Message);
            }
            return Ok(booking);
        }

        [HttpGet("GetBookingsByHousekeeperID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByHousekeeperID([FromQuery] int housekeeperId)
        {
            var bookings = await _bookingService.GetBookingsByHousekeeperIDAsync(housekeeperId);
            if (bookings == null || !bookings.Any())
            {
                Message = "No records found!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpGet("GetBookingsByFamilyID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByFamilyID([FromQuery] int familyId)
        {
            var bookings = await _bookingService.GetBookingsByFamilyIDAsync(familyId);
            if (bookings == null || !bookings.Any())
            {
                Message = "No records found!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpGet("GetBookingsByJobID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByJobID([FromQuery] int jobId)
        {
            var bookings = await _bookingService.GetBookingsByJobIDAsync(jobId);
            if (bookings == null || !bookings.Any())
            {
                Message = "No records found!";
                return NotFound(Message);
            }
            return Ok(bookings);
        }

        [HttpPost("AddBooking")]
        [Authorize]
        public async Task<ActionResult> AddBooking(
            [FromQuery] int jobId,
            [FromQuery] int housekeeperId,
            [FromQuery] int familyId,
            [FromQuery] int serviceId,
            [FromQuery] DateTime scheduledDate,
            [FromQuery] int bookingStatus
        )
        {
            var booking = new Booking
            {
                JobID = jobId,
                HousekeeperID = housekeeperId,
                FamilyID = familyId,
                ServiceID = serviceId,
                ScheduledDate = scheduledDate,
                BookingStatus = bookingStatus,
                CreatedAt = DateTime.UtcNow
            };

            await _bookingService.AddBookingAsync(booking);
            Message = "Booking created successfully!";
            return Ok(Message);
        }

        [HttpPut("UpdateBooking")]
        [Authorize]
        public async Task<ActionResult> UpdateBooking([FromQuery] BookingUpdateDTO bookingUpdateDTO)
        {
            var booking = _mapper.Map<Booking>(bookingUpdateDTO);
            var existingBooking = await _bookingService.GetBookingByIDAsync(bookingUpdateDTO.BookingID);
            if (existingBooking == null)
            {
                Message = "Booking not found!";
                return NotFound(Message);
            }

            await _bookingService.UpdateBookingAsync(booking);
            Message = "Booking updated successfully!";
            return Ok(Message);
        }

        [HttpDelete("DeleteBooking")]
        [Authorize]
        public async Task<ActionResult> DeleteBooking([FromQuery] int id)
        {
            var booking = await _bookingService.GetBookingByIDAsync(id);
            if (booking == null)
            {
                Message = "No records found!";
                return NotFound(Message);
            }

            await _bookingService.DeleteBookingAsync(id);
            Message = "Booking deleted successfully!";
            return Ok(Message);
        }
    }
}