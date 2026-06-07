import { PrismaClient, FoodCategory, GerdRiskLevel } from '@prisma/client';

const prisma = new PrismaClient();

const foodItems = [
  // ==========================================
  // RISIKO TINGGI (HIGH RISK) - Pemicu Utama
  // ==========================================
  { name: 'Seblak Pedas', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Sangat pedas dan berminyak, melemahkan katup lambung.', isVerified: true },
  { name: 'Kopi Susu Gula Aren', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Tinggi kafein dan lemak dari susu/krimer, memicu produksi asam.', isVerified: true },
  { name: 'Mie Instan Kuah Pedas', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Mengandung pengawet dan bumbu pedas yang mengiritasi dinding lambung.', isVerified: true },
  { name: 'Ayam Geprek', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Kombinasi digoreng *deep-fry* dan sambal sangat pedas.', isVerified: true },
  { name: 'Gorengan (Bala-bala/Gehu)', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Tinggi lemak jenuh yang memperlambat pengosongan lambung.', isVerified: true },
  { name: 'Minuman Bersoda (Cola)', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Gas karbonasi meningkatkan tekanan di dalam lambung.', isVerified: true },
  { name: 'Cokelat Batang', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Mengandung methylxanthine yang mengendurkan katup esofagus.', isVerified: true },
  { name: 'Rendang Sapi', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Santan kental dan bumbu rempah tajam sangat berat dicerna.', isVerified: true },
  { name: 'Jeruk Peras murni', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Tingkat keasaman (pH) sangat rendah, mengiritasi langsung.', isVerified: true },
  { name: 'Tomat Segar', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Secara alami sangat asam, sering menjadi pemicu *heartburn*.', isVerified: true },
  { name: 'Cireng Bumbu Rujak', category: FoodCategory.SNACK, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Tepung digoreng minyak banyak dipadu bumbu asam pedas.', isVerified: true },
  { name: 'Keju Cheddar Olahan', category: FoodCategory.DAIRY, gerdRiskLevel: GerdRiskLevel.HIGH, description: 'Tinggi lemak, memperlambat pencernaan secara signifikan.', isVerified: true },
  
  // ==========================================
  // RISIKO SEDANG (MEDIUM RISK) - Tergantung Porsi
  // ==========================================
  { name: 'Roti Putih', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Karbohidrat olahan, bisa memicu kembung pada beberapa orang.', isVerified: true },
  { name: 'Susu Sapi Full Cream', category: FoodCategory.DAIRY, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Kandungan lemaknya bisa jadi masalah jika dikonsumsi banyak.', isVerified: true },
  { name: 'Telur Mata Sapi (Ceplok)', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Aman jika minyak sedikit, berisiko jika terlalu berminyak.', isVerified: true },
  { name: 'Nasi Goreng', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Kandungan minyak dan kecap bisa memicu gejala ringan.', isVerified: true },
  { name: 'Jus Apel', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Sedikit asam, amannya dikonsumsi setelah makan.', isVerified: true },
  { name: 'Bawang Putih Tumis', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Bawang adalah pemicu bagi sebagian orang, tapi lebih aman jika dimasak matang.', isVerified: true },
  { name: 'Sate Ayam (Bumbu Kacang)', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Bumbu kacang lumayan berat untuk dicerna lambung sensitif.', isVerified: true },
  { name: 'Mie Bakso Kuah', category: FoodCategory.OTHER, gerdRiskLevel: GerdRiskLevel.MEDIUM, description: 'Aman jika tanpa saus/sambal/cuka berlebih.', isVerified: true },

  // ==========================================
  // RISIKO RENDAH (LOW RISK) - Ramah Lambung (Aman)
  // ==========================================
  { name: 'Nasi Putih', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Karbohidrat kompleks yang mudah dicerna lambung.', isVerified: true },
  { name: 'Oatmeal', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Kaya serat, menyerap asam lambung berlebih.', isVerified: true },
  { name: 'Dada Ayam Rebus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Protein tanpa lemak yang sangat ramah pencernaan.', isVerified: true },
  { name: 'Putih Telur Rebus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Bebas lemak, tidak memicu asam lambung.', isVerified: true },
  { name: 'Bayam Bening', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Sayuran hijau yang mudah dicerna dan tidak memicu gas.', isVerified: true },
  { name: 'Labu Siam Rebus', category: FoodCategory.VEGETABLE, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Sangat menenangkan lambung dan mudah dicerna.', isVerified: true },
  { name: 'Pepaya Segar', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Mengandung enzim papain yang melancarkan pencernaan.', isVerified: true },
  { name: 'Pisang Manis', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Melapisi dinding lambung dan menetralkan asam (pilih yang sudah matang).', isVerified: true },
  { name: 'Melon', category: FoodCategory.FRUIT, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Buah dengan tingkat pH tinggi (basa) yang sangat aman.', isVerified: true },
  { name: 'Air Kelapa Murni', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Elektrolit alami, sangat baik meredakan panas lambung.', isVerified: true },
  { name: 'Ikan Nila Panggang', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Protein ringan, pastikan tidak menggunakan bumbu pedas.', isVerified: true },
  { name: 'Tahu Kukus', category: FoodCategory.PROTEIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Olahan kedelai yang lembut dan sangat aman.', isVerified: true },
  { name: 'Singkong Rebus', category: FoodCategory.GRAIN, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Alternatif karbohidrat yang ramah lambung.', isVerified: true },
  { name: 'Air Putih Mineral', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Kunci utama hidrasi sehat untuk penderita GERD.', isVerified: true },
  { name: 'Teh Chamomile', category: FoodCategory.BEVERAGE, gerdRiskLevel: GerdRiskLevel.LOW, description: 'Menenangkan otot pencernaan dan meredakan stres.', isVerified: true },
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