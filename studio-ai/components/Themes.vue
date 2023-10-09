<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    data: {
        type: [Object],
    },
})

/*

Nightcafe Themes
01. Artistic Portrait
02. Striking            * SDXL *
03. Anime v2            * SDXL *
04. Hyperreal           * SDXL *
05. Vibrant             * SDXL *
06. Epic Oragami        * SDXL *
07. 3D Game v2
08. Color Painting      * SDXL *
09. Mecha
10. CGI Character
11. Epic
12. Dark Fantasy
13. Modern Comic
14. Abstract Curves     * SDXL *
15. Bon Voyage
16. Cubist v2
17. Detailed Gouache
18. Neo Impressionist
19. Pop Art
20. Anime
21. Candy v2
22. Photo
23. B&W Portrait
24. Color Portrait
25. Oil Painting
26. Cosmic
27. Sinister
28. Candy
29. Cubist
30. 3D Game
31. Fantasy
32. Gouache
33. Matte
34. Charcoal
35. Horror
36. Surreal
37. Steampunk
38. Cyberpunk
39. Synthwave
40. Heavenly
41. None

*/

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="h-full flex flex-col gap-4">
        <label
            for="file-upload"
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Photography
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                id="file-upload"
                name="file-upload"
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Pixel Art
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Digital Art
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Futuristic
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>
    </main>
</template>
