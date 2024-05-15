using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using TooGoodToGoNotifier.Entities;
using TooGoodToGoNotifier.Interfaces;
using TooGoodToGoNotifier.Models;

namespace TooGoodToGoNotifier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public UserController(ILogger<UserController> logger, IUserService userService, IConfiguration config)
        {
            _logger = logger;
            _userService = userService;
            _config = config;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsersAsync()
        {
            IEnumerable<User> users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        /// <summary>
        /// Create a user
        /// </summary>
        /// <returns></returns>
        [HttpPost()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserRequest request)
        {
            await _userService.CreateUserAsync(request.Email);
            return Ok();
        }
        
        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody] GoogleIdToken idToken)
        {
            try
            {
                var validatedPayload = GoogleJsonWebSignature.ValidateAsync(idToken.token, new GoogleJsonWebSignature.ValidationSettings()).Result;
                var user = await _userService.Authenticate(validatedPayload);
                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["JwtSecret"]));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    //new Claim(JwtRegisteredClaimNames.Sub, Security.Encrypt("", user.Email)), //AppSettings.appSettings.JwtEmailEncryption
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("picture", user.Picture),
                };
                var token = new JwtSecurityToken(string.Empty,
                  string.Empty,
                  claims,
                  expires: DateTime.Now.AddHours(24),
                  signingCredentials: credentials);
                
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                BadRequest(ex.Message);
            }
            return BadRequest();
        }
    }
}
