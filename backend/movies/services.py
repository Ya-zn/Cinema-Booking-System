from datetime import timedelta

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .exceptions import BookingError

from .models import (
    Showtime,
    ShowtimeSeat,
    Booking,
)


# ==========================================
# Internal helper
# ==========================================



def _release_locked_booking(
    booking,
    showtime_seats,
    new_status
):
    for showtime_seat in showtime_seats:

        showtime_seat.status = (
            ShowtimeSeat.Status.AVAILABLE
        )

        showtime_seat.booking = None
        showtime_seat.hold_expires_at = None

        showtime_seat.save()

    booking.status = new_status

    booking.save(
        update_fields=["status"]
    )


# ==========================================
# Hold seats
# ==========================================

def hold_seats(
    showtime_id,
    showtime_seat_ids,
    hold_minutes=10
):

    showtime = get_object_or_404(
        Showtime,
        pk=showtime_id
    )

    with transaction.atomic():

        showtime_seats = list(
            ShowtimeSeat.objects
            .select_for_update()
            .filter(
                id__in=showtime_seat_ids
            )
            .order_by("pk")
        )

        if len(showtime_seats) != len(
            showtime_seat_ids
        ):
            raise BookingError(
                "One or more seats do not exist."
            )

        for showtime_seat in showtime_seats:

            if (
                showtime_seat.showtime_id
                != showtime.id
            ):
                raise BookingError(
                    "Seat does not belong to this showtime."
                )

            if (
                showtime_seat.seat.hall_id
                != showtime.hall_id
            ):
                raise BookingError(
                    "Seat does not belong to the show's hall."
                )

            if (
                showtime_seat.status
                != ShowtimeSeat.Status.AVAILABLE
            ):
                raise BookingError(
                    "One or more seats are not available."
                )

        booking = Booking.objects.create(
            showtime=showtime,
            status=Booking.Status.PENDING
        )

        expires_at = (
            timezone.now()
            + timedelta(
                minutes=hold_minutes
            )
        )

        for showtime_seat in showtime_seats:

            showtime_seat.status = (
                ShowtimeSeat.Status.HELD
            )

            showtime_seat.booking = booking

            showtime_seat.hold_expires_at = (
                expires_at
            )

            showtime_seat.save()

        return booking


# ==========================================
# Expire booking
# ==========================================

def expire_booking(booking_id):

    with transaction.atomic():

        booking = (
            Booking.objects
            .select_for_update()
            .get(pk=booking_id)
        )

        if (
            booking.status
            != Booking.Status.PENDING
        ):
            return booking

        showtime_seats = list(
            ShowtimeSeat.objects
            .select_for_update()
            .filter(
                booking=booking
            )
            .order_by("pk")
        )

        _release_locked_booking(
            booking,
            showtime_seats,
            Booking.Status.EXPIRED
        )

        return booking


# ==========================================
# Confirm booking
# ==========================================

def confirm_booking(booking_id):

    expired = False

    with transaction.atomic():

        booking = (
            Booking.objects
            .select_for_update()
            .get(pk=booking_id)
        )

        if (
            booking.status
            != Booking.Status.PENDING
        ):
            raise BookingError(
                "Booking is not pending."
            )

        showtime_seats = list(
            ShowtimeSeat.objects
            .select_for_update()
            .filter(
                booking=booking
            )
            .order_by("pk")
        )

        if not showtime_seats:
            raise BookingError(
                "Booking has no seats."
            )

        now = timezone.now()

        for showtime_seat in showtime_seats:

            if (
                showtime_seat.status
                != ShowtimeSeat.Status.HELD
            ):
                raise BookingError(
                    "One or more seats are not held."
                )

            if (
                showtime_seat.hold_expires_at
                and
                showtime_seat.hold_expires_at
                <= now
            ):
                expired = True
                break

        if expired:

            _release_locked_booking(
                booking,
                showtime_seats,
                Booking.Status.EXPIRED
            )

        else:

            for showtime_seat in showtime_seats:

                showtime_seat.status = (
                    ShowtimeSeat.Status.BOOKED
                )

                showtime_seat.hold_expires_at = None

                showtime_seat.save()

            booking.status = (
                Booking.Status.CONFIRMED
            )

            booking.save(
                update_fields=["status"]
            )

   
    if expired:
        raise BookingError(
            "Booking hold has expired."
        )

    return booking


def cancel_booking(booking_id):

    with transaction.atomic():

        booking = (
            Booking.bjects
            .select_for_update()
            .get(pk=booking_id)
        )

        if(booking.status != Booking.Status.PENDING):
            raise BookingError(
                "only pending booking can be cancelled."
            )

        showtime_seats = list(
            ShowtimeSeat.objects
            .select_for_update()
            .filter(
                booking=booking
            )
        )

        _release_locked_booking(
            booking,
            showtime_seats,
            Booking.Status.CANCELLED
        )

        return booking