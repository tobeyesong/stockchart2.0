// src/utils/SegmentTree.js

class SegmentTree {

    constructor(total, L, R) {
        this.sum = total;
        this.left = null;
        this.right = null;
        this.L = L;
        this.R = R;
    }

    // O(n)
    static build(nums, L, R) {
        if (L === R) {
            return new SegmentTree(nums[L], L, R);
        }

        const M = Math.floor((L + R) / 2);
        const root = new SegmentTree(0, L, R);
        root.left = SegmentTree.build(nums, L, M);
        root.right = SegmentTree.build(nums, M + 1, R);
        root.sum = root.left.sum + root.right.sum;
        return root;
    }

    // O(log n)
    update(index, val) {
        if (this.L === this.R) {
            this.sum = val;
            return;
        }

        const M = Math.floor((this.L + this.R) / 2);
        if (index > M) {
            this.right.update(index, val);
        } else {
            this.left.update(index, val);
        }
        this.sum = this.left.sum + this.right.sum;
    }

    // O(log n)
    rangeQuery(L, R) {
        if (L === this.L && R === this.R) {
            return this.sum;
        }

        const M = Math.floor((this.L + this.R) / 2);
        if (L > M) {
            return this.right.rangeQuery(L, R);
        } else if (R <= M) {
            return this.left.rangeQuery(L, R);
        } else {
            return this.left.rangeQuery(L, M) + this.right.rangeQuery(M + 1, R);
        }
    }
}

export default SegmentTree;
