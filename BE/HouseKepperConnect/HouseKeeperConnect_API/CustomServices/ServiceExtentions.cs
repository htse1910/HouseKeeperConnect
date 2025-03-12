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
        services.AddScoped<IScheduleRepository, ScheduleRepository>();
        services.AddScoped<IScheduleService, ScheduleService>();
        services.AddScoped<IIDVerificationService, IDVerificationService>();
        services.AddScoped<IIDVerificationRepository, IDVerificationRepository>();
        services.AddScoped<IJobRepository, JobRepository>();
        services.AddScoped<IJobService, JobService>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IChatService, ChatService>();
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