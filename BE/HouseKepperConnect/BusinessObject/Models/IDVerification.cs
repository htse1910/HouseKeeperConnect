using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class IDVerification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDNumber { get; set; }

        [Required]
        public byte[] FrontPhoto { get; set; }

        [Required]
        public byte[] BackPhoto { get; set; }

        [Required]
        public byte[] FacePhoto { get; set; }

        [Required]
        public bool Status { get; set; }
    }
}
