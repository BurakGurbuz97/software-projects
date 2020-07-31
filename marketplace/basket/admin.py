from django.contrib import admin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .forms import CouponActionForm
from .models import (
    Basket,
    BasketItem,
    Coupon,
    Discount,
    Ruleset,
    CouponUser,
    AllowedUsersRule,
    MaxUsesRule,
    ValidityRule,
)


@admin.register(BasketItem)
class BasketItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'basket', 'quantity', 'created_at', 'updated_at')
    fields = ('product', 'basket', 'quantity')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('product',)


class BasketItemInline(admin.StackedInline):
    model = BasketItem
    extra = 0
    show_change_link = True


@admin.register(Basket)
class BasketAdmin(admin.ModelAdmin):
    list_display = ('user', 'coupon_code', 'total', 'created_at', 'updated_at')
    fields = ('user', 'coupon_code', 'total')
    readonly_fields = ('total', 'created_at', 'updated_at')
    inlines = (BasketItemInline,)


# Coupon Code

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    action_form = CouponActionForm
    list_display = ('code', 'discount', 'ruleset', 'times_used', 'created_at')
    actions = ['delete_expired_coupons', 'duplicate_n_times']

    def delete_expired_coupons(self, request, queryset):
        count = 0
        for coupon in queryset:
            expiration_date = coupon.ruleset.validity.expiration_date
            if timezone.now() >= expiration_date:
                coupon.delete()
                count += 1

        self.message_user(request, _("{0} expired coupons deleted!").format(count))

    delete_expired_coupons.short_description = _("Delete expired coupons")

    def duplicate_n_times(self, request, queryset):
        n = int(request.POST['count'])
        coupon = queryset.first()

        for i in range(n):
            Coupon.objects.create(
                discount=coupon.discount,
                ruleset=coupon.ruleset,
            )

        self.message_user(request, _("Coupon was duplicated {0} times with new codes.").format(n))

    duplicate_n_times.short_description = _("Duplicate coupon n times with new codes")


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    pass


@admin.register(Ruleset)
class RulesetAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'allowed_users', 'max_uses', 'validity',)


@admin.register(CouponUser)
class CouponUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'coupon', 'times_used',)
    actions = ['reset_coupon_usage']

    def reset_coupon_usage(self, request, queryset):
        for coupon_user in queryset:
            coupon_user.times_used = 0
            coupon_user.save()

        self.message_user(request, _("Selected coupon usages were reset!"))

    reset_coupon_usage.short_description = _("Reset selected coupon usages")


@admin.register(AllowedUsersRule)
class AllowedUsersRuleAdmin(admin.ModelAdmin):
    def get_model_perms(self, request):
        return {}


@admin.register(MaxUsesRule)
class MaxUsesRuleAdmin(admin.ModelAdmin):
    def get_model_perms(self, request):
        return {}


@admin.register(ValidityRule)
class ValidityRuleAdmin(admin.ModelAdmin):
    def get_model_perms(self, request):
        return {}
