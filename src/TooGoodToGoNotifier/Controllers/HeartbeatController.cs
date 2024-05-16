using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TooGoodToGoNotifier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HeartbeatController : ControllerBase
    {
        [HttpGet("heartbeat")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<string> GetHeartbeat()
        {
            return Ok("ok");
        }

        [HttpGet("isloggedin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<string> GetIsLoggedIn()
        {
            return Ok(true);
        }
    }
}
