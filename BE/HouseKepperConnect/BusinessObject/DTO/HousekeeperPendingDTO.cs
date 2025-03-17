using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class HousekeeperPendingDTO
    {
        public int HousekeeperID { get; set; }
        public string Name { get; set; }
        public int VerifyID { get; set; }
        public byte[] FrontPhoto { get; set; }
        public byte[] BackPhoto { get; set; }
        public byte[] FacePhoto { get; set; }
    }
}
