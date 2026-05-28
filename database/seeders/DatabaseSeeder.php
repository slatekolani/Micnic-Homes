<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account — only this account can log in
        $owner = User::create([
            'name'    => 'Micnic Admin',
            'email'   => 'admin@micnicvilla.com',
            'password'=> Hash::make('password'),
            'role'    => 'admin',
            'phone'   => '+255 700 000 000',
            'bio'     => 'Premium serviced apartments and villas in Tanzania.',
            'country' => 'Tanzania',
        ]);

        // Placeholder images — replace with real Pixieset URLs once available
        $placeholders = [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
        ];

        $properties = [
            [
                'title'               => 'Micnic Luxury Penthouse Suite',
                'short_description'   => 'Breathtaking city views from a fully-serviced penthouse in the heart of Dar es Salaam.',
                'description'         => "Welcome to Micnic Penthouse Suite — an unparalleled retreat perched high above the city. This fully-serviced luxury penthouse offers sweeping panoramic views of Dar es Salaam and the Indian Ocean beyond.\n\nThe spacious open-plan living area is bathed in natural light, featuring premium furnishings, a fully equipped gourmet kitchen, and a private wraparound terrace perfect for sundowners. Sleep in absolute comfort in the master suite with an en-suite marble bathroom and freestanding soaking tub.\n\nOur dedicated concierge team is available 24/7 to arrange airport transfers, restaurant reservations, guided tours, and anything else your stay requires.",
                'type'                => 'penthouse',
                'address'             => '14 Ocean View Road',
                'city'                => 'Dar es Salaam',
                'state'               => 'Dar es Salaam',
                'country'             => 'Tanzania',
                'price_per_night'     => 350,
                'weekend_price'       => null,
                'cleaning_fee'        => 50,
                'security_deposit'    => 200,
                'bedrooms'            => 3,
                'bathrooms'           => 3,
                'max_guests'          => 6,
                'area_sqm'            => 280,
                'min_stay_nights'     => 2,
                'amenities'           => ['wifi', 'pool', 'parking', 'kitchen', 'ac', 'tv', 'gym', 'balcony', 'workspace'],
                'check_in_time'       => '14:00',
                'check_out_time'      => '11:00',
                'cancellation_policy' => 'moderate',
                'featured'            => true,
                'status'              => 'active',
                'avg_rating'          => 4.9,
                'review_count'        => 24,
            ],
            [
                'title'               => 'Micnic Garden Villa',
                'short_description'   => 'Serene private villa surrounded by lush tropical gardens with a sparkling pool.',
                'description'         => "Escape to the Micnic Garden Villa — a private sanctuary nestled within lush tropical gardens. This stunning villa combines traditional Swahili architecture with modern luxury, offering an immersive experience of coastal Tanzanian living.\n\nStep outside to your private pool and sundeck, surrounded by fragrant frangipani and palms. The interior boasts vaulted makuti ceilings, handcrafted furniture, and curated local artwork. The fully equipped kitchen and outdoor BBQ area make it ideal for families and groups who enjoy home-cooked meals.\n\nJust minutes from the beach and local markets, the Garden Villa is the perfect base for exploring everything Tanzania has to offer.",
                'type'                => 'villa',
                'address'             => '7 Msasani Peninsula',
                'city'                => 'Dar es Salaam',
                'state'               => 'Dar es Salaam',
                'country'             => 'Tanzania',
                'price_per_night'     => 280,
                'weekend_price'       => null,
                'cleaning_fee'        => 40,
                'security_deposit'    => 150,
                'bedrooms'            => 4,
                'bathrooms'           => 4,
                'max_guests'          => 8,
                'area_sqm'            => 350,
                'min_stay_nights'     => 3,
                'amenities'           => ['wifi', 'pool', 'parking', 'kitchen', 'ac', 'tv', 'garden', 'bbq', 'washer'],
                'check_in_time'       => '15:00',
                'check_out_time'      => '11:00',
                'cancellation_policy' => 'moderate',
                'featured'            => true,
                'status'              => 'active',
                'avg_rating'          => 4.8,
                'review_count'        => 18,
            ],
            [
                'title'               => 'Micnic Executive Studio',
                'short_description'   => 'A sleek, fully-serviced studio ideal for business travellers and couples.',
                'description'         => "The Micnic Executive Studio is designed for the modern traveller who demands style, comfort and connectivity. Compact yet meticulously appointed, this self-contained studio features a king-sized bed, a fully equipped kitchenette, and a dedicated high-speed workspace.\n\nLocated in a prime Dar es Salaam neighbourhood with easy access to the central business district, international schools, and major amenities. Complimentary airport transfer is available on request.\n\nAll Micnic serviced apartments include weekly housekeeping, fresh linen service, and 24/7 on-call maintenance.",
                'type'                => 'studio',
                'address'             => '22 Kinondoni Road',
                'city'                => 'Dar es Salaam',
                'state'               => 'Dar es Salaam',
                'country'             => 'Tanzania',
                'price_per_night'     => 95,
                'weekend_price'       => null,
                'cleaning_fee'        => 20,
                'security_deposit'    => 100,
                'bedrooms'            => 1,
                'bathrooms'           => 1,
                'max_guests'          => 2,
                'area_sqm'            => 55,
                'min_stay_nights'     => 1,
                'amenities'           => ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'washer'],
                'check_in_time'       => '14:00',
                'check_out_time'      => '11:00',
                'cancellation_policy' => 'flexible',
                'featured'            => false,
                'status'              => 'active',
                'avg_rating'          => 4.7,
                'review_count'        => 11,
            ],
            [
                'title'               => 'Micnic Beachfront Apartment',
                'short_description'   => 'Wake up to ocean waves — a stunning beachfront apartment steps from the shore.',
                'description'         => "There is nothing quite like waking up to the sound of the Indian Ocean just metres from your door. The Micnic Beachfront Apartment offers direct beach access, unobstructed ocean views from every room, and a private balcony where you can watch the sunrise over the water.\n\nThe apartment is beautifully furnished with coastal-inspired décor, featuring a fully equipped kitchen, spacious living area, and two en-suite bedrooms. Whether you're here for a romantic getaway or a family holiday, this apartment promises memories that will last a lifetime.\n\nComplimentary beach chairs, umbrellas and snorkelling equipment are provided for all guests.",
                'type'                => 'apartment',
                'address'             => '1 Beach Road, Oyster Bay',
                'city'                => 'Dar es Salaam',
                'state'               => 'Dar es Salaam',
                'country'             => 'Tanzania',
                'price_per_night'     => 195,
                'weekend_price'       => 230,
                'cleaning_fee'        => 35,
                'security_deposit'    => 150,
                'bedrooms'            => 2,
                'bathrooms'           => 2,
                'max_guests'          => 4,
                'area_sqm'            => 120,
                'min_stay_nights'     => 2,
                'amenities'           => ['wifi', 'beachfront', 'kitchen', 'ac', 'tv', 'balcony', 'parking'],
                'check_in_time'       => '14:00',
                'check_out_time'      => '10:00',
                'cancellation_policy' => 'moderate',
                'featured'            => true,
                'status'              => 'active',
                'avg_rating'          => 5.0,
                'review_count'        => 7,
            ],
        ];

        foreach ($properties as $i => $data) {
            $property = Property::create(array_merge($data, [
                'owner_id' => $owner->id,
            ]));

            // 3 images per property cycling through placeholders
            foreach (array_slice($placeholders, $i % count($placeholders), 3) as $idx => $url) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url'         => $url,
                    'sort_order'  => $idx,
                    'is_primary'  => $idx === 0,
                ]);
            }
        }
    }
}
