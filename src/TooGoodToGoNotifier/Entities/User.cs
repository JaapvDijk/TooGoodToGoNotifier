﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TooGoodToGoNotifier.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        public Guid Id { get; set; }

        public string Email { get; set; }
        public string Picture { get; set; }
        public string FirstName { get; set; }
        public string OauthSubject { get; set; }
        public string OauthIssuer { get; set; }


        public List<string> FavoriteBaskets { get; set; }
    }
}
