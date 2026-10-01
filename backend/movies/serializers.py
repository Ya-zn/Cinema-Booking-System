from datetime import timedelta

from rest_framework import serializers
from .models import Movie, Showtime, Hall, Seat, ShowtimeSeat, Booking
from django.utils import timezone


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "rating",
            "year",
            "runtime_minutes"
        ]



    def validate_rating(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError(
                "Rating must be between 0 and 10"
            )
        
        return value

    def validate_year(self, value):
        if value < 1800 :
            raise serializers.ValidationError(
                "Invalid movie year."
            )

        return value


class HallSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hall
        fields = [
            "id",
            "name",
            "capacity",
        ]


class ShowtimeSerializer(serializers.ModelSerializer):

    movie = MovieSerializer(read_only=True)

    movie_id = serializers.PrimaryKeyRelatedField(
        queryset=Movie.objects.all(),
        source="movie",
        write_only=True,
    )

    hall = HallSerializer(read_only=True)

    hall_id = serializers.PrimaryKeyRelatedField(
        queryset=Hall.objects.all(),
        source="hall",
        write_only=True,
    )

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie",
            "movie_id",
            "hall",
            "hall_id",
            "start_time",
        ]


    def validate_start_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                "Showtime must be in the future"
            )

        return value

    def validate(self, attrs):

        movie = attrs.get(
            "movie",
            getattr(
                self.instance,
                "movie",
                None
            )
        )

        hall = attrs.get(
            "hall",
            getattr(
                self.instance,
                "hall",
                None
            )
        )

        start_time = attrs.get(
            "start_time",
            getattr(
                self.instance,
                "start_time",
                None
            )
        )

        end_time = (
            start_time
            + timedelta(
                minutes=movie.runtime_minutes
            )
        )

        hall_showtimes = Showtime.objects.filter(
            hall=hall
        )

        if self.instance:
            hall_showtimes = hall_showtimes.exclude(
                pk=self.instance.pk
            )

        for existing_showtime in hall_showtimes:

            existing_start = (
                existing_showtime.start_time
            )

            existing_end = (
                existing_start
                + timedelta(
                    minutes=
                    existing_showtime.movie.runtime_minutes
                )
            )

            if (
                start_time < existing_end
                and
                end_time > existing_start
            ):
                raise serializers.ValidationError({
                    "start_time":
                        "This hall already has an overlapping showtime."
                })

        return attrs

class BookingCreateSerializer(serializers.Serializer):
    showtime_id = serializers.IntegerField()

    showtime_seat_ids = serializers.ListField(
        child = serializers.IntegerField(),
        allow_empty = False
    )


    def validate_showttime_seat_ids(self, value):
        if len(value) != len(set(value)):
            raise ValueError(
                "Duplicate seats are not allowed."
            )
        return value

class SeatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seat
        fields = [
            "id",
            "row",
            "number"
        ]

class ShowtimeSeatSerializer(serializers.ModelSerializer):

     seat = SeatSerializer(
         read_only = True
     )

     class Meta :
         model = ShowtimeSeat
         fields = [
             "id",
             "seat",
             "status",
             "hold_expires_at"
         ]

class BookingSerializer(
    serializers.ModelSerializer
):

    showtime = ShowtimeSerializer(
        read_only=True
    )

    showtime_seats = (
        ShowtimeSeatSerializer(
            many=True,
            read_only=True
        )
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "showtime",
            "status",
            "showtime_seats",
            "created_at",
        ]