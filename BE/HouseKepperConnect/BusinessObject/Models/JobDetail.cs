using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class JobDetail
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobDetailID { get; set; }
        public int JobID { get; set; }
        public int Frequency { get; set; }
        public string Location { get; set; }
        public int Rate { get; set; }
        public int ExpectedHour { get; set; }
        public string SpecialRequest { get; set; }
        public int ServiceID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public virtual Job Job { get; set; }
    }
}
