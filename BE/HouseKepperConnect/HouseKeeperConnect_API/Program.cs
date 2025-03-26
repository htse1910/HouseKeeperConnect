using Appwrite;
using BusinessObject.Mapping;
using BusinessObject.Models.AppWrite;
using HouseKeeperConnect_API.CustomServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
        ValidAudience = builder.Configuration["JwtConfig:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"])),

        ValidateIssuer = !string.IsNullOrEmpty(builder.Configuration["JwtConfig:Issuer"]),
        ValidateAudience = !string.IsNullOrEmpty(builder.Configuration["JwtConfig:Audience"]),
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
});

var appwriteSettings = builder.Configuration.GetSection("Appwrite").Get<AppwriteSettings>();

// Configure Appwrite Client
var client = new Client()
    .SetEndpoint(appwriteSettings.Endpoint) // Your Appwrite endpoint
    .SetProject(appwriteSettings.ProjectId) // Your project ID
    .SetKey(appwriteSettings.ApiKey); // Optional: Your API key if needed

builder.Services.AddSingleton(client);

builder.Services.AddCustomServices();

builder.Services.AddControllers();
builder.Services.AddAuthorization();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(typeof(MappingConfig));
builder.Services.AddSignalR();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ADD THIS LINE TO ENABLE CORS
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.Run();