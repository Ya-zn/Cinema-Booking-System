from django.contrib import admin
from .models import Movie, Showtime, Hall, Seat, Booking, ShowtimeSeat

admin.site.register(Movie)
admin.site.register(Showtime)
admin.site.register(Hall)
admin.site.register(Seat)
admin.site.register(Booking)
admin.site.register(ShowtimeSeat)