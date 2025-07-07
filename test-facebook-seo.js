import axios from 'axios';

// Test Facebook SEO by simulating Facebook crawler
async function testFacebookSEO() {
    console.log('🔍 Testing Facebook SEO for product page...\n');
    
    // Test with a sample product slug
    const productSlug = 'sample-product'; // You can change this to an actual product slug
    const testUrl = `http://localhost:3002/products/${productSlug}`;
    
    try {
        const response = await axios.get(testUrl, {
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            }
        });
        
        console.log('✅ Status:', response.status);
        console.log('✅ Headers:', response.headers);
        console.log('\n📄 HTML Content (first 2000 chars):');
        console.log(response.data.substring(0, 2000));
        
        // Check for Open Graph tags
        const ogTags = [
            'og:title',
            'og:description',
            'og:image',
            'og:url',
            'og:type',
            'product:price:amount',
            'product:price:currency'
        ];
        
        console.log('\n🔍 Open Graph Tags Check:');
        ogTags.forEach(tag => {
            const regex = new RegExp(`<meta\\s+property="${tag}"\\s+content="([^"]*)"`, 'i');
            const match = response.data.match(regex);
            if (match) {
                console.log(`✅ ${tag}: ${match[1]}`);
            } else {
                console.log(`❌ ${tag}: Not found`);
            }
        });
        
        // Check for schema.org structured data
        const schemaRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i;
        const schemaMatch = response.data.match(schemaRegex);
        
        if (schemaMatch) {
            console.log('\n✅ Schema.org structured data found:');
            try {
                const schema = JSON.parse(schemaMatch[1]);
                console.log(JSON.stringify(schema, null, 2));
            } catch (e) {
                console.log('❌ Schema.org data found but invalid JSON');
            }
        } else {
            console.log('\n❌ No schema.org structured data found');
        }
        
    } catch (error) {
        console.error('❌ Error testing Facebook SEO:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Test image serving
async function testImageServing() {
    console.log('\n🖼️ Testing image serving...\n');
    
    const imageUrl = 'http://localhost:3001/images/photo-1572569511254-d8f925fe2cbb.jpg';
    
    try {
        const response = await axios.head(imageUrl);
        console.log('✅ Image Status:', response.status);
        console.log('✅ Content-Type:', response.headers['content-type']);
        console.log('✅ Content-Length:', response.headers['content-length']);
    } catch (error) {
        console.error('❌ Error testing image serving:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
    }
}

// Run tests
testFacebookSEO();
testImageServing();
