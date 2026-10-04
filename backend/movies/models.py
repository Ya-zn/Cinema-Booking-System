from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=200)
    rating = models.FloatField()
    year = models.IntegerField()

    runtime_minutes = models.PositiveIntegerField()


    def __str__(self):
     return self.title


class Hall(models.Model):
   name = models.CharField(
      max_length=100
   )

   capacity = models.PositiveIntegerField()

   def __str__(self):
      return self.name


class Showtime(models.Model):
   movie = models.ForeignKey(
      Movie,
      on_delete=models.CASCADE,
      related_name="showtimes"
   )

   hall = models.ForeignKey(
      Hall,
      on_delete=models.PROTECT,
      related_name="showtimes"
   )

   start_time = models.DateTimeField()

   def __str__(self):
      return f"{self.movie.title} - {self.hall} - {self.start_time}"


class Seat(models.Model):

   hall = models.ForeignKey(
      Hall,
      on_delete=models.CASCADE,
      related_name= "seats"
   )

   row = models.CharField(max_length=5)

   number = models.PositiveIntegerField()

   class Meta:
      constraints= [
         models.UniqueConstraint(
            fields=[
               "hall",
               "row",
               "number"
            ],
            name= "unique_seat_per_hall"
         )
      ]
   

   def __str__(self):
      return f"{self.hall.name} - {self.row}{self.number}"


class Booking(models.Model):

   class Status(models.TextChoices):
      PENDING = "pending" , "Pending"
      CONFIRMED = "confirmed" , "Confirmed"
      CANCELLED = "cancelled" , "Cancelled"
      EXPIRED  =  "expired" , "Expired"

   showtime = models.ForeignKey(
      Showtime,
      on_delete= models.PROTECT,
      related_name= "bookings"
   )

   status = models.CharField(
      max_length=20,
      choices=Status.choices,
      default=Status.PENDING
   )

   created_at = models.DateTimeField(
      auto_now_add=True
   )

   def __str__(self):
      return f" Booking {self.id}"


class ShowtimeSeat(models.Model):

   class Status(models.TextChoices):
      AVAILABLE = "available", "Available"
      HELD = "held", "Held"
      BOOKED = "booked", "Booked"

   showtime = models.ForeignKey(
      Showtime,
      on_delete=models.CASCADE,
      related_name="showtime_seats"
   )

   seat = models.ForeignKey(
      Seat,
      on_delete=models.PROTECT,
      related_name="showtime_seats"
   )

   booking = models.ForeignKey(
      Booking,
      on_delete=models.SET_NULL,
      null=True,
      blank=True,
      related_name="showtime_seats"

   )

   status = models.CharField(
      max_length=20,
      choices=Status.choices,
      default=Status.AVAILABLE
   )

   hold_expires_at = models.DateTimeField(
      null= True,
      blank= True
   )

   class Meta:
      constraints =[
         models.UniqueConstraint(
         fields=[
            "showtime",
            "seat"
         ],
         name="unique_seat_per_showtime"
         )
      ]

   def __str__(self):
      return (f"{self.showtime} -" 
               f"{self.seat}")