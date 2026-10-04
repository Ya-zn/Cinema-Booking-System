from django.urls import path

from .views import (
MovieListView, 
MovieDetailView,
ShowTimeListView,
HallListView,
ShowTimeDetailView,
BookingCreateView,
BookingDetailView,
BookingConfirmView,
BookingCancelView
)



urlpatterns = [
    path("movies/", MovieListView.as_view(), name='movie_list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name="mvoie_detail"),
    path('showtimes/', ShowTimeListView.as_view(), name = "showtime_list"),
    path('halls/', HallListView.as_view(), name="hall_list"),
    path('showtimedetail/<int:pk>/', ShowTimeDetailView.as_view(), name= "showtime_detail"),
    path('bookings/', BookingCreateView.as_view(), name="booking_create"),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name="booking_detail"),
    path('bookings/<int:pk>/confirm/', BookingConfirmView.as_view(), name="booking_confirm"),
    path('bookings/<int:pk>/cancel', BookingCancelView.as_view(), name="booking_cancel")
]