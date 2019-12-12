const MAIN_CONTAINER_SELECTOR = 'main-container';
const PAGE_BOTTOM_OFFSET = 200; // pixels
const SCROLL_TIMEOUT = 100; // milliseconds

const scrollBottomHandlingMixin = Base =>
    class extends Base {
        constructor(...args) {
            super(...args);

            this.scrollHandler = f => f;
            this.scrollTimeout = null;
            this.lastScrollTop = 0;
            this.scrollContainer = MAIN_CONTAINER_SELECTOR;
        }

        setScrollContainer(id) {
            this.scrollContainer = id;
        }

        scrollToTop() {
            const container = document.getElementById(this.scrollContainer);
            if (container) {
                container.scrollTop = 0;
            }
        }

        handleScroll(event, condition, callback) {
            const { target } = event;
            clearTimeout(this.scrollTimeout);

            this.scrollTimeout = setTimeout(() => {
                const { scrollTop, clientHeight, scrollHeight } = target;
                const isScrollDown = scrollTop > this.lastScrollTop;
                const delta = scrollHeight - scrollTop - clientHeight;

                if (delta <= PAGE_BOTTOM_OFFSET && isScrollDown && condition()) {
                    callback();
                }

                this.lastScrollTop = scrollTop;
            }, SCROLL_TIMEOUT);
        }

        // Do not forget remove all scroll handlers on unmount step of your container (#removeScrollHandler())
        setupScrollHandler(condition, callback) {
            this.scrollHandler = event => this.handleScroll(event, condition, callback);
            document.getElementById(this.scrollContainer).addEventListener('scroll', this.scrollHandler);
        }

        removeScrollHandler() {
            document.getElementById(this.scrollContainer).removeEventListener('scroll', this.scrollHandler);
        }
    };

export default scrollBottomHandlingMixin;
