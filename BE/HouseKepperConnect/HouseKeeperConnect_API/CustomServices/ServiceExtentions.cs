using BusinessObject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using Repositories;
using Repositories.Interface;
using Services;
using Services.Interface;

public static class ServiceExtentions
{
    public static void AddCustomServices(this IServiceCollection services)
    {
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IPasswordHasher<Account>, PasswordHasher<Account>>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IWalletService, WalletService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IHouseKeeperRepository, HouseKeeperRepository>();
        services.AddScoped<IHouseKeeperService, HouseKeeperService>();
        services.AddScoped<IFamilyProfileRepository, FamilyProfileRepository>();
        services.AddScoped<IFamilyProfileService, FamilyProfileService>();
        services.AddScoped<IIDVerificationService, IDVerificationService>();
        services.AddScoped<IIDVerificationRepository, IDVerificationRepository>();
        services.AddScoped<IJobRepository, JobRepository>();
        services.AddScoped<IJobService, JobService>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IWithdrawRepository, WithdrawRepository>();
        services.AddScoped<IWithdrawService, WithdrawService>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<IVerificationTaskRepository, VerificationTaskRepository>();
        services.AddScoped<IVerificationTaskService, VerificationTaskService>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IJob_ServiceRepository, Job_ServiceRepository>();
        services.AddScoped<IJob_ServiceService, Job_ServiceService>();
        services.AddScoped<IJob_SlotsRepository, Job_SlotsRepository>();
        services.AddScoped<IJob_SlotsService, Job_SlotsService>();
        services.AddScoped<IBooking_SlotsService, Booking_SlotsService>();
        services.AddScoped<IBooking_SlotsRepository, Booking_SlotsRepository>();
        services.AddScoped<IHousekeeperSkillMappingRepository, HousekeeperSkillMappingRepository>();
        services.AddScoped<IHousekeeperSkillMappingService, HousekeeperSkillMappingService>();
        services.AddScoped<IHousekeeperSkillRepository, HousekeeperSkillRepository>();
        services.AddScoped<IHousekeeperSkillService, HousekeeperSkillService>();
        services.AddScoped<IViolationRepository, ViolationRepository>();
        services.AddScoped<IViolationService, ViolationService>();
        services.AddScoped<IHousekeeper_ViolationRepository, Housekeeper_ViolationRepository>();
        services.AddScoped<IHousekeeper_ViolationService, Housekeeper_ViolationService>();
        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<IRatingService, RatingService>();
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IPayoutRepository, PayoutRepository>();
        services.AddScoped<IPayoutService, PayoutService>();
        services.AddScoped<ISupportRequestRepository, SupportRequestRepository>();
        services.AddScoped<ISupportRequestService, SupportRequestService>();
        services.AddHttpContextAccessor();
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow frontend
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("Housekeeper", policy => policy.RequireClaim("RoleID", "1"));
            options.AddPolicy("Family", policy => policy.RequireClaim("RoleID", "2"));
            options.AddPolicy("Staff", policy => policy.RequireClaim("RoleID", "3"));
            options.AddPolicy("Admin", policy => policy.RequireClaim("RoleID", "4"));
        });

        services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "Housekeeper API", Version = "v1" });
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Jwtorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
        });
    }
}