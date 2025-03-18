using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusinessObject.Models;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerificationTasksController : ControllerBase
    {
        private readonly PCHWFDBContext _context;

        public VerificationTasksController(PCHWFDBContext context)
        {
            _context = context;
        }

        // GET: api/VerificationTasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VerificationTask>>> GetVerificationTask()
        {
            return await _context.VerificationTask.ToListAsync();
        }

        // GET: api/VerificationTasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VerificationTask>> GetVerificationTask(int id)
        {
            var verificationTask = await _context.VerificationTask.FindAsync(id);

            if (verificationTask == null)
            {
                return NotFound();
            }

            return verificationTask;
        }

        // PUT: api/VerificationTasks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerificationTask(int id, VerificationTask verificationTask)
        {
            if (id != verificationTask.TaskID)
            {
                return BadRequest();
            }

            _context.Entry(verificationTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VerificationTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/VerificationTasks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VerificationTask>> PostVerificationTask(VerificationTask verificationTask)
        {
            _context.VerificationTask.Add(verificationTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVerificationTask", new { id = verificationTask.TaskID }, verificationTask);
        }

        // DELETE: api/VerificationTasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVerificationTask(int id)
        {
            var verificationTask = await _context.VerificationTask.FindAsync(id);
            if (verificationTask == null)
            {
                return NotFound();
            }

            _context.VerificationTask.Remove(verificationTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VerificationTaskExists(int id)
        {
            return _context.VerificationTask.Any(e => e.TaskID == id);
        }
    }
}
