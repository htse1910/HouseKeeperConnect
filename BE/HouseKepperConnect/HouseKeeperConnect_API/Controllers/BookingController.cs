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

            try
            {
                // 🔹 Retrieve the Job
                var job = await _jobService.GetJobByIDAsync(bookingCreateDTO.JobID);
                if (job == null)
                {
                    return NotFound("Job not found.");
                }

                // ✅ Check if the job has been accepted (Status == 3)
                if (job.Status != 3)
                {
                    return BadRequest("Booking can only be created when the job has been accepted.");
                }

                // 🔹 Retrieve Job Details
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(bookingCreateDTO.JobID);

                // 🔹 Retrieve Job Slots
                var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(bookingCreateDTO.JobID);
                if (jobSlots == null || !jobSlots.Any())
                {
                    return BadRequest("No slots found for the job.");
                }

                // ✅ First, check if ANY slot is already booked before creating the Booking
                List<string> bookedSlotMessages = new List<string>(); // Collect errors
                DateTime currentDate = jobDetail.StartDate;
                while (currentDate <= jobDetail.EndDate)
                {
                    foreach (var slot in jobSlots)
                    {
                        DateTime bookingDate = GetNextDayOfWeek(currentDate, slot.DayOfWeek);
                        if (bookingDate > jobDetail.EndDate)
                            continue;

                        bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                            bookingCreateDTO.HousekeeperID, slot.SlotID, slot.DayOfWeek, jobDetail.StartDate, jobDetail.EndDate
                        );

                        if (isSlotBooked)
                        {
                            bookedSlotMessages.Add($"Slot {slot.SlotID} on day {slot.DayOfWeek} is already booked.");
                        }
                    }
                    currentDate = currentDate.AddDays(7);
                }

                // ✅ If any slot is already booked, do NOT create the booking
                if (bookedSlotMessages.Any())
                {
                    return Conflict($"Booking cannot be created because the following slots are already booked:\n{string.Join("\n", bookedSlotMessages)}");
                }

                // 🔹 Create the Booking (ONLY IF ALL SLOTS ARE AVAILABLE)
                var newBooking = new Booking
                {
                    JobID = job.JobID,
                    HousekeeperID = bookingCreateDTO.HousekeeperID,
                    CreatedAt = DateTime.Now,
                    Status = (int)BookingStatus.Pending
                };

                await _bookingService.AddBookingAsync(newBooking);

                // 🔹 Add BookingSlots
                currentDate = jobDetail.StartDate;
                while (currentDate <= jobDetail.EndDate)
                {
                    foreach (var slot in jobSlots)
                    {
                        DateTime bookingDate = GetNextDayOfWeek(currentDate, slot.DayOfWeek);
                        if (bookingDate > jobDetail.EndDate)
                            continue;

                        var newBookingSlot = new Booking_Slots
                        {
                            BookingID = newBooking.BookingID,
                            SlotID = slot.SlotID,
                            DayOfWeek = slot.DayOfWeek,
                        };

                        await _bookingSlotsService.AddBooking_SlotsAsync(newBookingSlot);
                    }

                    currentDate = currentDate.AddDays(7);
                }

                return Ok("Booking created successfully with associated slots!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddBooking: {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        private DateTime GetNextDayOfWeek(DateTime startDate, int dayOfWeek)
        {
            int daysUntilNext = ((dayOfWeek - (int)startDate.DayOfWeek + 7) % 7);
            return startDate.AddDays(daysUntilNext == 0 ? 7 : daysUntilNext);
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