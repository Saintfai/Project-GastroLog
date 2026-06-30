import { PrismaClient, FoodCategory, GerdRiskLevel } from '@prisma/client';

const prisma = new PrismaClient();

const foodItems = [
  // ==========================================
  // RISIKO TINGGI (HIGH RISK) - Pemicu Utama
  // ==========================================
  { name: 'Seblak Pedas', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Kopi Susu Gula Aren', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Mie Instan Kuah Pedas', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Ayam Geprek', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Gorengan (Bala-bala/Gehu)', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Minuman Bersoda (Cola)', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Cokelat Batang', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Rendang Sapi', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Jeruk Peras murni', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Tomat Segar', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Cireng Bumbu Rujak', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  { name: 'Keju Cheddar Olahan', category: FoodCategory.DAIRY, gerdRiskLevel: GerdRiskLevel.HIGH, isVerified: true },
  
  // ==========================================
  // RISIKO SEDANG (MEDIUM RISK) - Tergantung Porsi
  // ==========================================
  { name: 'Roti Putih', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Susu Sapi Full Cream', category: FoodCategory.DAIRY, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Telur Mata Sapi (Ceplok)', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Nasi Goreng', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Jus Apel', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Bawang Putih Tumis', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Sate Ayam (Bumbu Kacang)', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },
  { name: 'Mie Bakso Kuah', category: FoodCategory.OTHER, gerdRiskLevel: GerdRiskLevel.MEDIUM, isVerified: true },

  // ==========================================
  // RISIKO RENDAH (LOW RISK) - Ramah Lambung (Aman)
  // ==========================================
  { name: 'Nasi Putih', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Oatmeal', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Dada Ayam Rebus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Putih Telur Rebus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Bayam Bening', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Labu Siam Rebus', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Pepaya Segar', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Pisang Manis', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Melon', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Air Kelapa Murni', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Ikan Nila Panggang', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Tahu Kukus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Singkong Rebus', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Air Putih Mineral', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
  { name: 'Teh Chamomile', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, isVerified: true },
];

async function main() {
  console.log(`Mulai melakukan seeding untuk ${foodItems.length} data makanan...`);
  
  // Menggunakan createMany untuk memasukkan semua data sekaligus
  const result = await prisma.foodItem.createMany({
    data: foodItems,
    skipDuplicates: true, // Abaikan jika nama makanan sudah ada sebelumnya
  });

  console.log(`Seeding selesai! Berhasil menambahkan ${result.count} makanan ke database.`);
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });