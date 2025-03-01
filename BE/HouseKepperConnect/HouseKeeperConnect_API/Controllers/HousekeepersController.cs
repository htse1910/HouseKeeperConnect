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
    public class HousekeepersController : ControllerBase
    {
        private readonly PCHWFDBContext _context;

        public HousekeepersController(PCHWFDBContext context)
        {
            _context = context;
        }

        // GET: api/Housekeepers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Housekeeper>>> GetHousekeeper()
        {
            return await _context.Housekeeper.ToListAsync();
        }

        // GET: api/Housekeepers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Housekeeper>> GetHousekeeper(int id)
        {
            var housekeeper = await _context.Housekeeper.FindAsync(id);

            if (housekeeper == null)
            {
                return NotFound();
            }

            return housekeeper;
        }

        // PUT: api/Housekeepers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHousekeeper(int id, Housekeeper housekeeper)
        {
            if (id != housekeeper.HouseKeeperID)
            {
                return BadRequest();
            }

            _context.Entry(housekeeper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HousekeeperExists(id))
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

        // POST: api/Housekeepers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Housekeeper>> PostHousekeeper(Housekeeper housekeeper)
        {
            _context.Housekeeper.Add(housekeeper);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHousekeeper", new { id = housekeeper.HouseKeeperID }, housekeeper);
        }

        // DELETE: api/Housekeepers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHousekeeper(int id)
        {
            var housekeeper = await _context.Housekeeper.FindAsync(id);
            if (housekeeper == null)
            {
                return NotFound();
            }

            _context.Housekeeper.Remove(housekeeper);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HousekeeperExists(int id)
        {
            return _context.Housekeeper.Any(e => e.HouseKeeperID == id);
        }
    }
}
