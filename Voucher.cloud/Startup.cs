using Voucher.cloud.Commons;
using Voucher.cloud.Context;
using Voucher.cloud.Converter;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.DatabaseFrameworks.Repositories;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            DbProviderFactories.RegisterFactory("Microsoft.Data.SqlClient", SqlClientFactory.Instance);
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ServiceConnection")));

            // ===== Add Identity ========            
            services.AddIdentity<ApplicationUser, ApplicationRole>(options => {
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;
                options.Tokens.EmailConfirmationTokenProvider = "emailconfirmation";
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<EmailConfirmationTokenProvider<ApplicationUser>>("emailconfirmation");
            
            services.AddScoped<IAccountSupportRepository, AccountSupportRepository>();
            services.AddScoped<IUserRightDataRepository, UserRightDataRepository>();
            services.AddScoped<IMemvarDataRepository, MemvarDataRepository>();
            services.AddScoped<ICommonDataRepository, CommonDataRepository>();
            services.AddScoped<IVoucherTypeDataRepository, VoucherTypeDataRepository>();
            services.AddScoped<IVoucherDataRepository, VoucherDataRepository>();
            services.AddScoped<IDMPHONGBANDataRepository, DMPHONGBANDataRepository>();
            services.AddScoped<IDMCOSOCUAHANGDataRepository, DMCOSOCUAHANGDataRepository>();
            services.AddScoped<IDMKHACHHANGDataRepository, DMKHACHHANGDataRepository>();
            services.AddScoped<IQTNHATKYHETHONGDataRepository, QTNHATKYHETHONGDataRepository>();
            services.AddScoped<IUserProfileDataRepository, UserProfileDataRepository>();
            services.AddScoped<IBaoCaoThongKeDataRepository, BaoCaoThongKeDataRepository>();
            services.AddScoped<IDMNguoiBanDataRepository, DMNguoiBanDataRepository>();
            services.AddScoped<ICHUCVUDataRepository, CHUCVUDataRepository>();

            services.Configure<DataProtectionTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromHours(2));

            services.Configure<EmailConfirmationTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromDays(3));

            services.AddControllersWithViews();
            services.AddControllers(options => options.MaxIAsyncEnumerableBufferLimit = 268435456).AddNewtonsoftJson();
            services.Configure<FormOptions>(options =>
            {
                // Set the limit to 256 MB
                options.MultipartBodyLengthLimit = 268435456;
            });

            services.AddSingleton<IConfiguration>(Configuration);
            services.AddSingleton<IFileProvider>(
            new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")));

            services.AddMvc(options =>
            {
            }).AddNewtonsoftJson(options => {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new UpcaseNamingStrategy()
                };
                options.SerializerSettings.ContractResolver = new NullToEmptyStringResolver();
                options.SerializerSettings.Converters.Add(new DateLongFormatConverter());
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.AccessDeniedPath = "/Identity/Account/Login";
                options.ExpireTimeSpan = TimeSpan.FromHours(24);
            });

            services.AddRazorPages().AddRazorPagesOptions(options =>
            {
                options.Conventions.AuthorizePage("/Home/Index");
                options.Conventions.AddAreaPageRoute("Identity", "/Account/Login", "/Account/Login");
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            loggerFactory.AddFile("Logs/GroupWware-{Date}.txt");
            app.UseHttpsRedirection();
            var provider = new FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".mrt"] = "application/xml";
            provider.Mappings[".xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            provider.Mappings[".xls"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

            app.UseRouting();
            //app.UseWebSockets();
            // global error handler
            //app.UseMiddleware<ErrorHandlerMiddleware>();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            string path = Path.Combine(env.WebRootPath, Common.MetadataFolder);
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
        }
    }
}
