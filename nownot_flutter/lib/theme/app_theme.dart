import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Dark Glassmorphic Color Palette
  static const Color background = Color(0xFF0B0F19);
  static const Color cardBackground = Color(0x99111827); // Semi-transparent dark
  static const Color glassBorder = Color(0x33FFFFFF);     // Translucent white border
  static const Color primaryAccent = Color(0xFF6366F1);   // Vibrant Indigo
  static const Color secondaryAccent = Color(0xFF06B6D4); // Neon Cyan
  static const Color successGreen = Color(0xFF10B981);   // Emerald Green
  static const Color warningOrange = Color(0xFFF59E0B);  // Amber
  static const Color dangerRose = Color(0xFFF43F5E);     // Rose Red
  static const Color textPrimary = Color(0xFFF9FAFB);
  static const Color textSecondary = Color(0xFF9CA3AF);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primaryAccent,
      colorScheme: const ColorScheme.dark(
        primary: primaryAccent,
        secondary: secondaryAccent,
        surface: cardBackground,
        error: dangerRose,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.bold, color: textPrimary),
        titleLarge: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.normal, color: textPrimary),
        bodyMedium: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.normal, color: textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
      ),
      useMaterial3: true,
    );
  }
}
