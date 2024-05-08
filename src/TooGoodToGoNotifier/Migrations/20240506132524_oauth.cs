using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TooGoodToGoNotifier.Migrations
{
    /// <inheritdoc />
    public partial class oauth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OauthIssuer",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OauthSubject",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OauthIssuer",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OauthSubject",
                table: "Users");
        }
    }
}
