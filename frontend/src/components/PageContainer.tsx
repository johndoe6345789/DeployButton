import Box from "@mui/material/Box";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        maxWidth: 768,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 5,
      }}
    >
      {children}
    </Box>
  );
}
