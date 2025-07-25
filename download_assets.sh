#!/bin/bash

echo "🚀 Downloading assets for Droguerie Jamal project..."

# Create necessary directories
mkdir -p server/uploads/products
mkdir -p client/public/assets/images

# Download Unsplash images for products
echo "📥 Downloading product images from Unsplash..."

# Array of unique Unsplash URLs
urls=(
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400"
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400"
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400"
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
    "https://images.unsplash.com/photo-1606787366850-de6ba128a8ec?w=400"
    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400"
)

# Download each image
counter=1
for url in "${urls[@]}"; do
    # Extract photo ID from URL
    photo_id=$(echo $url | grep -o 'photo-[^?]*')
    filename="product_${counter}_${photo_id}.jpg"

    echo "Downloading: $filename"
    curl -L -o "server/uploads/products/$filename" "$url"

    # Also save to client public folder for easy access
    cp "server/uploads/products/$filename" "client/public/assets/images/"

    ((counter++))
done

echo "📁 Creating placeholder images..."

# Create placeholder images using curl from a placeholder service
curl -L -o "client/public/placeholder-product.jpg" "https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Product+Image"
curl -L -o "client/public/placeholder-category.jpg" "https://via.placeholder.com/400x200/e9ecef/495057?text=Category+Image"

# Create different sized placeholders for the API endpoints
mkdir -p client/public/api/placeholder
curl -L -o "client/public/api/placeholder/300x200.jpg" "https://via.placeholder.com/300x200/f8f9fa/6c757d?text=Product"
curl -L -o "client/public/api/placeholder/200x200.jpg" "https://via.placeholder.com/200x200/f8f9fa/6c757d?text=Cart+Item"
curl -L -o "client/public/api/placeholder/500x400.jpg" "https://via.placeholder.com/500x400/f8f9fa/6c757d?text=Product+Detail"

echo "🎨 Creating favicon and logo placeholders..."

# Download a simple droguerie/general store icon
curl -L -o "client/public/favicon.ico" "https://via.placeholder.com/32x32/28a745/ffffff?text=D"
curl -L -o "client/public/logo.png" "https://via.placeholder.com/200x60/28a745/ffffff?text=Droguerie+Jamal"

echo "✅ Asset download completed!"
echo "📊 Summary:"
echo "   - Downloaded ${#urls[@]} product images from Unsplash"
echo "   - Created placeholder images for missing assets"
echo "   - Set up API placeholder endpoints"
echo "   - Added favicon and logo placeholders"
echo ""
echo "📁 Assets saved to:"
echo "   - server/uploads/products/ (for backend serving)"
echo "   - client/public/assets/images/ (for frontend access)"
echo "   - client/public/ (placeholders and favicon)"
