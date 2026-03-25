using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models.DB
{
    public partial class DmFile : Base
    {
        public string Id { get; set; }
        public string Ma_File { get; set; }
        public string Ten_File { get; set; }
        public string Ten_File_E { get; set; }
        public string FieldList { get; set; }
        public string FieldName { get; set; }
        public string FieldOrder { get; set; }
        public string FilterFieldList { get; set; }
        public int StartPos { get; set; }
        public int MaxRows { get; set; }
        public bool EachWord { get; set; }
        public bool? Access { get; set; }
    }
}
