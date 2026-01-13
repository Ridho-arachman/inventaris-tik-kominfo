import "dotenv/config";
import { auth } from "@/lib/auth";

export const createAdmin = async () => {
  try {
    const name = "DISKOMINFOSATIK";
    const email = "ridho.arachman56@gmail.com";
    const password = "Admin!23";

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "ADMIN",
        callbackURL: `${process.env.BETTER_AUTH_URL}/login`,
      },
    });

    console.log(`Admin ${result.user.name} Berhasil Dibuat 🎉🎉🎉`);
  } catch (error) {
    throw error;
  }
};

createAdmin();
