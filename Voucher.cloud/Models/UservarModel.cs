using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class UservarModel
    {
        public string Theme { get; set; } = "s3t-theme1"; //Giao diện
        public bool Has_Avatar { get; set; } = false; //Có hình đại diện không
        public int BillingualLanguage { get; set; } = 0; //0-Ngôn ngữ chính; 1-Ngôn ngữ phụ; 2-Song ngữ
        public string DecimalSymbol { get; set; } = ",";//Dấu chấm thập phân
        public string GroupingSymbol { get; set; } = ".";//Dấu phân biệt nghìn triệu tỷ
        public int CalculatorDecimals { get; set; } = 2;//Số chữ số sau dấu thập phân của máy tính cá nhân
        public int QuantityDecimals { get; set; } = 2;//Số chữ số sau dấu thập phân của số lượng
        public int NormQuantity { get; set; } = 0;//Số chữ số sau dấu thập phân của số lượng định mức
        public int RatioFormat { get; set; } = 2;//Số chữ số sau dấu thập phân của hệ số quy đổi
    }
}
