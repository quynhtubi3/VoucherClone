using System;
using System.Collections.Generic;

namespace Voucher.cloud.Models
{
    public partial class Menu : Base
    {
        public string Id { get; set; }
        public string Bar { get; set; }
        public string ParentId { get; set; }
        public string Type { get; set; }
        public string SubId { get; set; }
        public string Ma_File { get; set; }
        public string ChildId { get; set; }
        public string ControlId { get; set; }
        public string ControlType { get; set; }
        public string MenuRightType { get; set; } = "M";
        public string DockStyle { get; set; }
        public string ChildControlId { get; set; }
        public string Image_Name { get; set; }
        public string Image_Parent { get; set; }
        public string ExtraVar { get; set; }
        public bool IsContract { get; set; }
        public int OrderId { get; set; }
    }
}
