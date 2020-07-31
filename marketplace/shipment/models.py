
from user.models import User
from typing import Union
from django.db import models
from django.db.models import Avg
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _


# Create your models here.

class Shipment(models.Model):
    address_id = models.BigIntegerField(verbose_name='address_id', primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    selection = models.IntegerField(verbose_name='selection_number', default=0)
    address_name = models.CharField(verbose_name='address_name', max_length=60, default='')
    name = models.CharField(verbose_name='name', max_length=60, default='')
    surname = models.CharField(verbose_name='surname', max_length=60, default='')
    email = models.EmailField(verbose_name='email', max_length=60)
    phone = models.CharField(verbose_name='phone', max_length=60)

    city = models.CharField(
        verbose_name='city',
        max_length=2,
        choices=[
            ('01', "Adana"),
            ('02', "Adıyaman"),
            ('03', "Afyon"),
            ('04', "Ağrı"),
            ('05', "Amasya"),
            ('06', "Ankara"),
            ('07', "Antalya"),
            ('08', "Artvin"),
            ('09', "Aydın"),
            ('10', "Balıkesir"),
            ('11', "Bilecik"),
            ('12', "Bingöl"),
            ('13', "Bitlis"),
            ('14', "Bolu"),
            ('15', "Burdur"),
            ('16', "Bursa"),
            ('17', "Çanakkale"),
            ('18', "Çankırı"),
            ('19', "Çorum"),
            ('20', "Denizli"),
            ('21', "Diyarbakır"),
            ('22', "Edirne"),
            ('23', "Elazığ"),
            ('24', "Erzincan"),
            ('25', "Erzurum"),
            ('26', "Eskişehir"),
            ('27', "Gaziantep"),
            ('28', "Giresun"),
            ('29', "Gümüşhane"),
            ('30', "Hakkari"),
            ('31', "Hatay"),
            ('32', "Isparta"),
            ('33', "İçel(Mersin)"),
            ('34', "İstanbul"),
            ('35', "İzmir"),
            ('37', "Kastamonu"),
            ('38', "Kayseri"),
            ('39', "Kırklareli"),
            ('40', "Kırşehir"),
            ('41', "Kocaeli"),
            ('42', "Konya"),
            ('43', "Kütahya"),
            ('44', "Malatya"),
            ('45', "Manisa"),
            ('46', "K.maraş"),
            ('47', "Mardin"),
            ('48', "Muğla"),
            ('49', "Muş"),
            ('50', "Nevşehir"),
            ('51', "Niğde"),
            ('52', "Ordu"),
            ('53', "Rize"),
            ('54', "Sakarya"),
            ('55', "Samsun"),
            ('56', "Siirt"),
            ('57', "Sinop"),
            ('58', "Sivas"),
            ('59', "Tekirdağ"),
            ('60', "Tokat"),
            ('61', "Trabzon"),
            ('62', "Tunceli"),
            ('63', "Şanlıurfa"),
            ('64', "Uşak"),
            ('65', "Van"),
            ('66', "Yozgat"),
            ('67', "Zonguldak"),
            ('68', "Aksaray"),
            ('69', "Bayburt"),
            ('70', "Karaman"),
            ('71', "Kırıkkale"),
            ('72', "Batman"),
            ('73', "Şırnak"),
            ('74', "Bartın"),
            ('75', "Ardahan"),
            ('76', "Iğdır"),
            ('77', "Yalova"),
            ('78', "Karabük"),
            ('79', "Kilis"),
            ('80', "Osmaniye"),
            ('81', "Düzce"),
        ],
    )

    district = models.CharField(verbose_name='district', max_length=60, default='')
    neighborhood = models.CharField(verbose_name='neighborhood', max_length=60, default='')
    others = models.CharField(verbose_name='others', max_length=100, default='')
    extra = models.CharField(verbose_name='extra', max_length=100, default='')
    REQUIRED_FIELDS = ['phone', 'name', 'surname', 'district', 'city', 'email']
    field_order = {"address_id", "name", "surname", "email", "phone",
                   "city", "district", "neighborhood", "others", "extra"}

    class Meta:
        verbose_name = _("shipment")
        verbose_name_plural = _("shipments")

    def __str__(self) -> str:
        return self.name


