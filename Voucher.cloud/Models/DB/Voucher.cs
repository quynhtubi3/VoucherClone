using System;
using System.Text.Json.Serialization;
using Voucher.cloud.Converter;

namespace Voucher.cloud.Models.DB
{
    public partial class Voucher : Base
    {
        public Guid Id { get; set; }
        public string Serial { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]

        public Guid? BatchId { get; set; }

        public DateTime? SaleDate { get; set; }
        public Guid EnteredByUserId { get; set; }
        public Guid? SellerId { get; set; }
        //public string SellerCode { get; set; }
        public Guid? VoucherTypeId { get; set; }
        public int VoucherType { get; set; }
        public int ValidityPeriod { get; set; }
        public decimal SalePrice { get; set; }
        public int NumberOfUse { get; set; }
        public int NumberOfFree { get; set; }
        public int NumberOfUseRemaining { get; set; }
        public int NumberOfFreeRemaining { get; set; }
        public decimal IndividualCommission { get; set; }
        public decimal GroupCommission { get; set; }
        public string ApplicableLocation { get; set; }
        public DateTime? ActivationDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public Guid? CoSoCuaHangId { get; set; }
        public Guid? KhachHangId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerAddress { get; set; }
        public string BuyerEmail { get; set; }
        public int Status { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? CreatedAt { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? UpdateAt { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? Updateby { get; set; }
    }
}
