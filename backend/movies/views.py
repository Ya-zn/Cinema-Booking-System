from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from django.shortcuts import get_object_or_404

from .models import Movie, Showtime, Hall, Booking
from .serializers import MovieSerializer, ShowtimeSerializer, HallSerializer, BookingCreateSerializer, BookingSerializer
from .services import hold_seats , confirm_booking, cancel_booking
from .exceptions import BookingError



class MovieListView(APIView):

    def get(self, request):
        movies = Movie.objects.all()

        serializer = MovieSerializer(
            movies,
            many = True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(
            data = request.data
        )
        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status = status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status= status.HTTP_400_BAD_REQUEST
        )




class MovieDetailView(APIView):

    def get_object(self, pk):
        return get_object_or_404(
            Movie,
            pk = pk
        )

    def get(self, request, pk):

        movie = self.get_object(pk)

        seiralizer = MovieSerializer(movie)

        return Response(seiralizer.data)

    def patch(self, request, pk):

        movie = self.get_object(pk)

        serializer = MovieSerializer(
            movie,
            data = request.data,
            partial = True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status = status.HTTP_400_BAD_REQUEST

        )

    def delete(self, request, pk):
        movie = self.get_object(pk)

        movie.delete()

        return Response(
            status= status.HTTP_204_NO_CONTENT
        )



class ShowTimeListView(APIView):

    def get(self, request):
        showtimes = Showtime.objects.all()

        serializer = ShowtimeSerializer(
            showtimes,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = ShowtimeSerializer(
            data = request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status= status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status= status.HTTP_400_BAD_REQUEST
        )



class ShowTimeDetailView(APIView):
    def get_object(self,pk):
        return get_object_or_404(
            Showtime,
            pk=pk
        )

    def get(self, request, pk):
        showtime = self.get_object(pk)

        serializer = ShowtimeSerializer(
            showtime
        )

        return Response(
            serializer.data
        )

    def patch(self, request, pk):
        showtime = self.get_object(pk)

        serializer = ShowtimeSerializer(
            showtime,
            data = request.data,
            partial = True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, pk):
        showtime = self.get_object(pk)

        showtime.delete

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
        



class HallListView(APIView):

    def get(self, request):
        hall = Hall.objects.all()

        serializer = HallSerializer(
            hall,
            many= True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = HallSerializer(
            data = request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class BookingCreateView(APIView):

    def post(self, request):

        serializer = BookingCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            booking = hold_seats(
                showtime_id=(
                    serializer.validated_data[
                        "showtime_id"
                    ]
                ),
                showtime_seat_ids=(
                    serializer.validated_data[
                        "showtime_seat_ids"
                    ]
                )
            )

        except BookingError as error:
            return Response(
                {
                    "error" : str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        
        response_serializer = BookingSerializer(
            booking
            )
        
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

class BookingDetailView(APIView):

    def get(self, request, pk):

        booking = get_object_or_404(
            Booking,
            pk=pk
        )

        serializer = BookingSerializer(
            booking
        )

        return Response(
            serializer.data
        )

class BookingConfirmView(APIView):

    def post(self, request, pk):

        try:
            booking = confirm_booking(
                booking_id=pk
            )

        except BookingError as error:
            return Response(
                {
                    "error": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookingSerializer(
            booking
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class BookingCancelView(APIView):

    def post(self, request, pk):

        try:
            booking = cancel_booking(
                booking_id= pk
            )
        except BookingError as error:
            return Response(
                {
                    "error" : str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookingSerializer(

            booking
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )